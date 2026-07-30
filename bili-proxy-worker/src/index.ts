type Env = {
  ALLOW_ORIGIN?: string
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue }

const MIXIN_INDEX = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5,
  49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55,
  40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 62, 6, 63, 57,
  20, 34, 52, 59, 11, 36, 44
]

const UA_PC =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
const UA_FP =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0"
const REFERER = "https://www.bilibili.com"

const API_BASE = "https://api.bilibili.com"
const URL_NAV = `${API_BASE}/x/web-interface/nav`
const URL_FINGERPRINT = `${API_BASE}/x/frontend/finger/spi`
const URL_WBI_SEARCH = `${API_BASE}/x/web-interface/wbi/search/type`
const URL_WBI_VIEW = `${API_BASE}/x/web-interface/wbi/view`
const URL_WBI_PLAYURL = `${API_BASE}/x/player/wbi/playurl`
const URL_WEB_TICKET = `${API_BASE}/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket`

const UA_TICKET = "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0"
const WEB_TICKET_KEY = "XgwSnGZ1p"

type CachedValue<T> = { value: T; cachedAt: number; ttlMs: number }

const cache: {
  mixinKey?: CachedValue<string>
  anonCookieHeader?: CachedValue<string>
} = {}

function nowMs() {
  return Date.now()
}

function isFresh(v?: CachedValue<unknown>) {
  if (!v) return false
  return nowMs() - v.cachedAt < v.ttlMs
}

function json(data: JsonValue, init?: ResponseInit) {
  const headers = new Headers(init?.headers)
  headers.set("Content-Type", "application/json; charset=utf-8")
  return new Response(JSON.stringify(data), { ...init, headers })
}

function corsHeaders(request: Request, env: Env) {
  const allowOriginRaw = env.ALLOW_ORIGIN?.trim() || "*"
  const origin = request.headers.get("Origin") || ""

  const tokens = allowOriginRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const matchToken = (token: string, value: string) => {
    if (token === "*") return true
    if (token.endsWith("*")) return value.startsWith(token.slice(0, -1))
    return token === value
  }

  const isWildcard = tokens.includes("*") || allowOriginRaw === "*"
  const allow = isWildcard
    ? "*"
    : origin && tokens.some((t) => matchToken(t, origin))
      ? origin
      : tokens[0] || "*"

  const baseAllowHeaders = ["Content-Type", "Range", "X-Bili-Cookie"]
  const reqAllowHeaders = (request.headers.get("Access-Control-Request-Headers") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  const allowHeaders = Array.from(new Set([...baseAllowHeaders, ...reqAllowHeaders])).join(",")

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": allowHeaders,
    "Access-Control-Expose-Headers":
      "Content-Length,Content-Range,Accept-Ranges,Content-Type",
    "Access-Control-Max-Age": "86400"
  }
}

function withCors(request: Request, env: Env, response: Response) {
  const headers = new Headers(response.headers)
  const cors = corsHeaders(request, env)
  for (const [k, v] of Object.entries(cors)) headers.set(k, v)
  headers.set("Vary", "Origin")
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

function okText(text: string, init?: ResponseInit) {
  const headers = new Headers(init?.headers)
  headers.set("Content-Type", "text/plain; charset=utf-8")
  return new Response(text, { ...init, headers })
}

function readHeaderCookie(request: Request) {
  const v = request.headers.get("X-Bili-Cookie")
  if (!v) return null
  const trimmed = v.trim()
  return trimmed.length ? trimmed : null
}

async function md5Hex(input: string) {
  const buf = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest("MD5", buf)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function hmacSha256Hex(key: string, message: string) {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ])
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

function filterValue(v: string) {
  return v.replace(/[!'()*]/g, "")
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return ""
  const re = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`)
  const m = cookieHeader.match(re)
  return m?.[1] || ""
}

function makeMixinKey(imgUrl: string, subUrl: string) {
  const imgKey = imgUrl.split("/").pop()?.split(".")[0] || ""
  const subKey = subUrl.split("/").pop()?.split(".")[0] || ""
  if (!imgKey || !subKey) throw new Error("Invalid wbi img/sub url")
  const raw = imgKey + subKey
  let mixed = ""
  for (const idx of MIXIN_INDEX) {
    if (idx < raw.length) mixed += raw[idx]
  }
  return mixed.slice(0, 32)
}

async function fetchMixinKeyFromTicket(cookieHeader: string | null) {
  const ts = Math.floor(Date.now() / 1000)
  const hexsign = await hmacSha256Hex(WEB_TICKET_KEY, `ts${ts}`)

  const url = new URL(URL_WEB_TICKET)
  url.searchParams.set("key_id", "ec02")
  url.searchParams.set("hexsign", hexsign)
  url.searchParams.set("context[ts]", String(ts))

  const csrf = getCookieValue(cookieHeader, "bili_jct")
  if (csrf) url.searchParams.set("csrf", csrf)

  const headers = new Headers()
  headers.set("User-Agent", UA_TICKET)

  const res = await fetch(url.toString(), { method: "POST", headers })
  const text = await res.text()
  const root = JSON.parse(text) as any
  const data = root?.data || {}
  const nav = data?.nav || {}
  const imgUrl = nav.img || ""
  const subUrl = nav.sub || ""
  return makeMixinKey(imgUrl, subUrl)
}

async function getOrRefreshMixinKey(cookieHeader: string | null) {
  if (isFresh(cache.mixinKey)) return cache.mixinKey!.value

  let mk = ""
  try {
    const headers = new Headers()
    headers.set("User-Agent", UA_PC)
    headers.set("Referer", REFERER)
    if (cookieHeader) headers.set("Cookie", cookieHeader)

    const res = await fetch(URL_NAV, { headers })
    const text = await res.text()
    const root = JSON.parse(text) as any
    const data = root?.data
    const wbiImg = data?.wbi_img || data?.nav || {}
    const imgUrl = wbiImg.img_url || wbiImg.img || ""
    const subUrl = wbiImg.sub_url || wbiImg.sub || ""
    mk = makeMixinKey(imgUrl, subUrl)
  } catch {
    mk = await fetchMixinKeyFromTicket(cookieHeader)
  }
  cache.mixinKey = { value: mk, cachedAt: nowMs(), ttlMs: 10 * 60 * 1000 }
  return mk
}

async function getOrRefreshAnonCookieHeader() {
  if (isFresh(cache.anonCookieHeader)) return cache.anonCookieHeader!.value

  const headers = new Headers()
  headers.set("User-Agent", UA_FP)
  const res = await fetch(URL_FINGERPRINT, { headers })
  const text = await res.text()
  const root = JSON.parse(text) as any
  const data = root?.data || {}
  const cookiePairs: string[] = []
  const put = (k: string, v: string | undefined) => {
    const val = (v || "").trim()
    if (val) cookiePairs.push(`${k}=${val}`)
  }
  put("buvid3", data.b_3 || data.buvid3)
  put("buvid4", data.b_4 || data.buvid4)
  put("buvid_fp", data.buvid_fp)
  put("buvid_fp_plain", data.buvid_fp_plain)
  put("b_lsid", data.b_lsid)

  const header = cookiePairs.join("; ")
  cache.anonCookieHeader = {
    value: header,
    cachedAt: nowMs(),
    ttlMs: 60 * 60 * 1000
  }
  return header
}

async function signWbiUrl(baseUrl: string, paramsIn: Record<string, string>, cookieHeader: string | null) {
  const mk = await getOrRefreshMixinKey(cookieHeader)
  const params = new Map<string, string>()
  for (const [k, v] of Object.entries(paramsIn)) params.set(k, filterValue(v))
  params.set("wts", String(Math.floor(Date.now() / 1000)))
  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
  const query = sorted
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&")
  const wRid = await md5Hex(query + mk)
  const url = new URL(baseUrl)
  for (const [k, v] of sorted) url.searchParams.set(k, v)
  url.searchParams.set("w_rid", wRid)
  return url.toString()
}

async function forwardJsonWithWbi(request: Request, env: Env, upstreamBaseUrl: string, params: Record<string, string>) {
  const userCookie = readHeaderCookie(request)
  const cookie = userCookie || (await getOrRefreshAnonCookieHeader())

  const signed = await signWbiUrl(upstreamBaseUrl, params, cookie)
  const headers = new Headers()
  headers.set("User-Agent", UA_PC)
  headers.set("Referer", REFERER)
  headers.set("Cookie", cookie)

  const res = await fetch(signed, { headers })
  const body = await res.text()
  const proxied = new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  })
  return withCors(request, env, proxied)
}

async function cachedJson(
  request: Request,
  env: Env,
  cacheKeyUrl: string,
  ttlSeconds: number,
  fetcher: () => Promise<Response>
) {
  const userCookie = readHeaderCookie(request)
  if (userCookie) return fetcher()

  const origin = request.headers.get("Origin") || ""
  const cacheUrl = new URL(cacheKeyUrl)
  cacheUrl.searchParams.set("_o", origin)

  const cache = (globalThis as any).caches.default as Cache
  const cacheReq = new Request(cacheUrl.toString(), { method: "GET" })
  const hit = await cache.match(cacheReq)
  if (hit) return hit

  const res = await fetcher()
  const headers = new Headers(res.headers)
  headers.set("Cache-Control", `public, max-age=${ttlSeconds}`)
  const toCache = new Response(res.body, { status: res.status, headers })
  await cache.put(cacheReq, toCache.clone())
  return toCache
}

type AudioPrefer = "lossless" | "dolby" | "high" | "medium" | "low" | "best"

function pickAudioUrl(playInfo: any, prefer: AudioPrefer) {
  const dash = playInfo?.data?.dash
  const dolby = dash?.dolby
  const flac = dash?.flac
  const dashAudio = Array.isArray(dash?.audio) ? dash.audio : []
  const dolbyAudio = Array.isArray(dolby?.audio) ? dolby.audio : []
  const flacAudio = flac?.audio

  const dashSorted = [...dashAudio].sort((a, b) => (b?.bandwidth || 0) - (a?.bandwidth || 0))
  const dolbySorted = [...dolbyAudio].sort((a, b) => (b?.bandwidth || 0) - (a?.bandwidth || 0))

  const pickDashByLevel = (level: "high" | "medium" | "low") => {
    if (!dashSorted.length) return null
    if (dashSorted.length === 1) return dashSorted[0]?.baseUrl || dashSorted[0]?.base_url || null
    if (level === "high") return dashSorted[0]?.baseUrl || dashSorted[0]?.base_url || null
    if (level === "low") return dashSorted[dashSorted.length - 1]?.baseUrl || dashSorted[dashSorted.length - 1]?.base_url || null
    const mid = dashSorted[Math.floor(dashSorted.length / 2)]
    return mid?.baseUrl || mid?.base_url || null
  }

  if (prefer === "lossless") {
    const url = flacAudio?.baseUrl || flacAudio?.base_url
    if (url) return url
    return dolbySorted[0]?.baseUrl || dolbySorted[0]?.base_url || pickDashByLevel("high")
  }

  if (prefer === "dolby") {
    return dolbySorted[0]?.baseUrl || dolbySorted[0]?.base_url || pickDashByLevel("high")
  }

  if (prefer === "high" || prefer === "medium" || prefer === "low") {
    return pickDashByLevel(prefer)
  }

  const best =
    flacAudio?.baseUrl ||
    flacAudio?.base_url ||
    dolbySorted[0]?.baseUrl ||
    dolbySorted[0]?.base_url ||
    dashSorted[0]?.baseUrl ||
    dashSorted[0]?.base_url

  return best || null
}

function pickMp4Url(playInfo: any) {
  const durl = playInfo?.data?.durl
  const first = Array.isArray(durl) ? durl[0] : null
  return first?.url || null
}

async function proxyStream(request: Request, env: Env, upstreamUrl: string, cookieHeader: string | null) {
  const range = request.headers.get("Range")
  const headers = new Headers()
  headers.set("User-Agent", UA_PC)
  headers.set("Referer", REFERER)
  if (cookieHeader) headers.set("Cookie", cookieHeader)
  if (range) headers.set("Range", range)

  const upstreamRes = await fetch(upstreamUrl, { headers })
  const outHeaders = new Headers(upstreamRes.headers)
  outHeaders.set("Accept-Ranges", upstreamRes.headers.get("Accept-Ranges") || "bytes")
  outHeaders.delete("Set-Cookie")

  const response = new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: outHeaders
  })
  return withCors(request, env, response)
}

async function handleAudio(request: Request, env: Env, url: URL) {
  const bvid = url.searchParams.get("bvid") || ""
  const cid = url.searchParams.get("cid") || ""
  const prefer = (url.searchParams.get("prefer") || "best") as AudioPrefer
  const mode = (url.searchParams.get("mode") || "dash").toLowerCase()
  const qn = url.searchParams.get("qn")
  const download = url.searchParams.get("download") === "1"
  const filename = (url.searchParams.get("filename") || "").trim()

  if (!bvid || !cid) return withCors(request, env, json({ error: "Missing bvid/cid" }, { status: 400 }))

  const userCookie = readHeaderCookie(request)
  const cookie = userCookie || (await getOrRefreshAnonCookieHeader())

  const params: Record<string, string> = {
    bvid,
    cid,
    fnval: "272",
    fnver: "0",
    fourk: "0",
    otype: "json",
    platform: mode === "html5" ? "html5" : "pc"
  }
  if (qn) params.qn = qn
  if (mode === "html5") {
    params.fnval = "0"
  }

  const signed = await signWbiUrl(URL_WBI_PLAYURL, params, cookie)
  const headers = new Headers()
  headers.set("User-Agent", UA_PC)
  headers.set("Referer", REFERER)
  headers.set("Cookie", cookie)

  const playRes = await fetch(signed, { headers })
  const playText = await playRes.text()
  const playJson = JSON.parse(playText) as any

  const upstreamUrl = mode === "html5" ? pickMp4Url(playJson) : pickAudioUrl(playJson, prefer)
  if (!upstreamUrl) {
    return withCors(
      request,
      env,
      json(
        {
          error: "No playable url",
          code: playJson?.code,
          message: playJson?.message
        },
        { status: 502 }
      )
    )
  }

  const proxied = await proxyStream(request, env, upstreamUrl, cookie)
  if (!download || !filename) return proxied

  const headersOut = new Headers(proxied.headers)
  const safe = filename.replace(/[\\/:*?"<>|]+/g, " ").trim() || "bili-audio.mp4"
  headersOut.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`)
  return new Response(proxied.body, { status: proxied.status, headers: headersOut })
}

function normalizeImageUrl(input: string) {
  const raw = (input || "").trim()
  if (!raw) return ""
  if (raw.startsWith("//")) return `https:${raw}`
  if (raw.startsWith("http://")) return raw.replace("http://", "https://")
  return raw
}

function isAllowedImageHost(hostname: string) {
  const h = hostname.toLowerCase()
  return h === "hdslb.com" || h.endsWith(".hdslb.com")
}

async function handleImage(request: Request, env: Env, url: URL) {
  const target = normalizeImageUrl(url.searchParams.get("url") || "")
  if (!target) return withCors(request, env, json({ error: "Missing url" }, { status: 400 }))

  let u: URL
  try {
    u = new URL(target)
  } catch {
    return withCors(request, env, json({ error: "Invalid url" }, { status: 400 }))
  }

  if (u.protocol !== "https:" || !isAllowedImageHost(u.hostname)) {
    return withCors(request, env, json({ error: "Not allowed" }, { status: 403 }))
  }

  const origin = request.headers.get("Origin") || ""
  const cacheUrl = new URL(request.url)
  cacheUrl.searchParams.set("_o", origin)

  const cache = (globalThis as any).caches.default as Cache
  const cacheReq = new Request(cacheUrl.toString(), { method: "GET" })
  const hit = await cache.match(cacheReq)
  if (hit) return withCors(request, env, hit)

  const headers = new Headers()
  headers.set("User-Agent", UA_PC)
  headers.set("Referer", REFERER)

  const res = await fetch(u.toString(), { headers })
  const outHeaders = new Headers(res.headers)
  outHeaders.delete("Set-Cookie")
  outHeaders.set("Cache-Control", "public, max-age=604800")
  const proxied = new Response(res.body, { status: res.status, headers: outHeaders })
  await cache.put(cacheReq, proxied.clone())
  return withCors(request, env, proxied)
}

function isPrivateHostname(hostname: string) {
  const h = hostname.toLowerCase()
  if (h === "localhost" || h.endsWith(".localhost")) return true
  if (h === "0.0.0.0") return true
  if (h === "127.0.0.1" || h.startsWith("127.")) return true
  if (h === "::1") return true
  if (h.includes(":")) return true

  const isIPv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(h)
  if (!isIPv4) return false

  const parts = h.split(".").map((x) => Number(x))
  if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true

  const [a, b] = parts
  if (a === 10) return true
  if (a === 192 && b === 168) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 169 && b === 254) return true

  return false
}

function safeDownloadName(input: string) {
  return input.replace(/[\\/:*?"<>|]+/g, " ").trim()
}

function inferFileNameFromUrl(u: URL) {
  const last = u.pathname.split("/").filter(Boolean).pop() || ""
  const clean = safeDownloadName(decodeURIComponent(last))
  return clean || `wallpaper-${Date.now()}.jpg`
}

async function handleWallpaperFile(request: Request, env: Env, url: URL) {
  const target = normalizeImageUrl(url.searchParams.get("url") || "")
  if (!target) return withCors(request, env, json({ error: "Missing url" }, { status: 400 }))

  let u: URL
  try {
    u = new URL(target)
  } catch {
    return withCors(request, env, json({ error: "Invalid url" }, { status: 400 }))
  }

  if (u.protocol !== "https:" || isPrivateHostname(u.hostname)) {
    return withCors(request, env, json({ error: "Not allowed" }, { status: 403 }))
  }

  const filename = safeDownloadName(url.searchParams.get("filename") || "") || inferFileNameFromUrl(u)

  const headers = new Headers()
  headers.set("User-Agent", UA_PC)
  if (u.hostname.toLowerCase().endsWith("hdslb.com")) {
    headers.set("Referer", REFERER)
  }

  const res = await fetch(u.toString(), { headers })
  const outHeaders = new Headers(res.headers)
  outHeaders.delete("Set-Cookie")
  outHeaders.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
  outHeaders.set("Cache-Control", "no-store")
  return withCors(request, env, new Response(res.body, { status: res.status, headers: outHeaders }))
}

function routeNotFound(request: Request, env: Env) {
  return withCors(request, env, json({ error: "Not found" }, { status: 404 }))
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const cors = corsHeaders(request, env)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors })
    }

    try {
      if (url.pathname === "/health") {
        return withCors(request, env, okText("ok"))
      }

      if (request.method !== "GET") {
        return withCors(request, env, json({ error: "Method not allowed" }, { status: 405 }))
      }

      if (url.pathname === "/api/bili/search") {
        const q = url.searchParams.get("q") || ""
        const page = url.searchParams.get("page") || "1"
        if (!q) return withCors(request, env, json({ error: "Missing q" }, { status: 400 }))
        return cachedJson(request, env, url.toString(), 60, () =>
          forwardJsonWithWbi(request, env, URL_WBI_SEARCH, {
            search_type: "video",
            keyword: q,
            page
          })
        )
      }

      if (url.pathname === "/api/bili/view") {
        const aid = url.searchParams.get("aid")
        const bvid = url.searchParams.get("bvid")
        if (!aid && !bvid) return withCors(request, env, json({ error: "Missing aid/bvid" }, { status: 400 }))
        const params: Record<string, string> = {}
        if (aid) params.aid = aid
        if (bvid) params.bvid = bvid
        return cachedJson(request, env, url.toString(), 3600, () => forwardJsonWithWbi(request, env, URL_WBI_VIEW, params))
      }

      if (url.pathname === "/api/bili/playurl") {
        const bvid = url.searchParams.get("bvid") || ""
        const cid = url.searchParams.get("cid") || ""
        const qn = url.searchParams.get("qn") || ""
        const mode = (url.searchParams.get("mode") || "dash").toLowerCase()
        if (!bvid || !cid) return withCors(request, env, json({ error: "Missing bvid/cid" }, { status: 400 }))
        const params: Record<string, string> = {
          bvid,
          cid,
          fnval: mode === "html5" ? "0" : "272",
          fnver: "0",
          fourk: "0",
          otype: "json",
          platform: mode === "html5" ? "html5" : "pc"
        }
        if (qn) params.qn = qn
        return cachedJson(request, env, url.toString(), 30, () => forwardJsonWithWbi(request, env, URL_WBI_PLAYURL, params))
      }

      if (url.pathname === "/api/bili/image") {
        return handleImage(request, env, url)
      }

      if (url.pathname === "/api/wallpaper/file") {
        return handleWallpaperFile(request, env, url)
      }

      if (url.pathname === "/api/bili/audio") {
        return handleAudio(request, env, url)
      }

      return routeNotFound(request, env)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return withCors(request, env, json({ error: "Internal error", message: msg }, { status: 500 }))
    }
  }
}
