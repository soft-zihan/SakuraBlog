var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var MIXIN_INDEX = [
  46,
  47,
  18,
  2,
  53,
  8,
  23,
  32,
  15,
  50,
  10,
  31,
  58,
  3,
  45,
  35,
  27,
  43,
  5,
  49,
  33,
  9,
  42,
  19,
  29,
  28,
  14,
  39,
  12,
  38,
  41,
  13,
  37,
  48,
  7,
  16,
  24,
  55,
  40,
  61,
  26,
  17,
  0,
  1,
  60,
  51,
  30,
  4,
  22,
  25,
  54,
  21,
  56,
  62,
  6,
  63,
  57,
  20,
  34,
  52,
  59,
  11,
  36,
  44
];
var UA_PC = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
var UA_FP = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0";
var REFERER = "https://www.bilibili.com";
var API_BASE = "https://api.bilibili.com";
var URL_NAV = `${API_BASE}/x/web-interface/nav`;
var URL_FINGERPRINT = `${API_BASE}/x/frontend/finger/spi`;
var URL_WBI_SEARCH = `${API_BASE}/x/web-interface/wbi/search/type`;
var URL_WBI_VIEW = `${API_BASE}/x/web-interface/wbi/view`;
var URL_WBI_PLAYURL = `${API_BASE}/x/player/wbi/playurl`;
var URL_WEB_TICKET = `${API_BASE}/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket`;
var UA_TICKET = "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0";
var WEB_TICKET_KEY = "XgwSnGZ1p";
var cache = {};
function nowMs() {
  return Date.now();
}
__name(nowMs, "nowMs");
function isFresh(v) {
  if (!v) return false;
  return nowMs() - v.cachedAt < v.ttlMs;
}
__name(isFresh, "isFresh");
function json(data, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}
__name(json, "json");
function corsHeaders(request, env) {
  const allowOriginRaw = env.ALLOW_ORIGIN?.trim() || "*";
  const origin = request.headers.get("Origin") || "";
  const tokens = allowOriginRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const matchToken = /* @__PURE__ */ __name((token, value) => {
    if (token === "*") return true;
    if (token.endsWith("*")) return value.startsWith(token.slice(0, -1));
    return token === value;
  }, "matchToken");
  const isWildcard = tokens.includes("*") || allowOriginRaw === "*";
  const allow = isWildcard ? "*" : origin && tokens.some((t) => matchToken(t, origin)) ? origin : tokens[0] || "*";
  const baseAllowHeaders = ["Content-Type", "Range", "X-Bili-Cookie"];
  const reqAllowHeaders = (request.headers.get("Access-Control-Request-Headers") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const allowHeaders = Array.from(/* @__PURE__ */ new Set([...baseAllowHeaders, ...reqAllowHeaders])).join(",");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": allowHeaders,
    "Access-Control-Expose-Headers": "Content-Length,Content-Range,Accept-Ranges,Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}
__name(corsHeaders, "corsHeaders");
function withCors(request, env, response) {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  headers.set("Vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
__name(withCors, "withCors");
function okText(text, init) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "text/plain; charset=utf-8");
  return new Response(text, { ...init, headers });
}
__name(okText, "okText");
function readHeaderCookie(request) {
  const v = request.headers.get("X-Bili-Cookie");
  if (!v) return null;
  const trimmed = v.trim();
  return trimmed.length ? trimmed : null;
}
__name(readHeaderCookie, "readHeaderCookie");
async function md5Hex(input) {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("MD5", buf);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(md5Hex, "md5Hex");
async function hmacSha256Hex(key, message) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hmacSha256Hex, "hmacSha256Hex");
function filterValue(v) {
  return v.replace(/[!'()*]/g, "");
}
__name(filterValue, "filterValue");
function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return "";
  const re = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`);
  const m = cookieHeader.match(re);
  return m?.[1] || "";
}
__name(getCookieValue, "getCookieValue");
function makeMixinKey(imgUrl, subUrl) {
  const imgKey = imgUrl.split("/").pop()?.split(".")[0] || "";
  const subKey = subUrl.split("/").pop()?.split(".")[0] || "";
  if (!imgKey || !subKey) throw new Error("Invalid wbi img/sub url");
  const raw = imgKey + subKey;
  let mixed = "";
  for (const idx of MIXIN_INDEX) {
    if (idx < raw.length) mixed += raw[idx];
  }
  return mixed.slice(0, 32);
}
__name(makeMixinKey, "makeMixinKey");
async function fetchMixinKeyFromTicket(cookieHeader) {
  const ts = Math.floor(Date.now() / 1e3);
  const hexsign = await hmacSha256Hex(WEB_TICKET_KEY, `ts${ts}`);
  const url = new URL(URL_WEB_TICKET);
  url.searchParams.set("key_id", "ec02");
  url.searchParams.set("hexsign", hexsign);
  url.searchParams.set("context[ts]", String(ts));
  const csrf = getCookieValue(cookieHeader, "bili_jct");
  if (csrf) url.searchParams.set("csrf", csrf);
  const headers = new Headers();
  headers.set("User-Agent", UA_TICKET);
  const res = await fetch(url.toString(), { method: "POST", headers });
  const text = await res.text();
  const root = JSON.parse(text);
  const data = root?.data || {};
  const nav = data?.nav || {};
  const imgUrl = nav.img || "";
  const subUrl = nav.sub || "";
  return makeMixinKey(imgUrl, subUrl);
}
__name(fetchMixinKeyFromTicket, "fetchMixinKeyFromTicket");
async function getOrRefreshMixinKey(cookieHeader) {
  if (isFresh(cache.mixinKey)) return cache.mixinKey.value;
  let mk = "";
  try {
    const headers = new Headers();
    headers.set("User-Agent", UA_PC);
    headers.set("Referer", REFERER);
    if (cookieHeader) headers.set("Cookie", cookieHeader);
    const res = await fetch(URL_NAV, { headers });
    const text = await res.text();
    const root = JSON.parse(text);
    const data = root?.data;
    const wbiImg = data?.wbi_img || data?.nav || {};
    const imgUrl = wbiImg.img_url || wbiImg.img || "";
    const subUrl = wbiImg.sub_url || wbiImg.sub || "";
    mk = makeMixinKey(imgUrl, subUrl);
  } catch {
    mk = await fetchMixinKeyFromTicket(cookieHeader);
  }
  cache.mixinKey = { value: mk, cachedAt: nowMs(), ttlMs: 10 * 60 * 1e3 };
  return mk;
}
__name(getOrRefreshMixinKey, "getOrRefreshMixinKey");
async function getOrRefreshAnonCookieHeader() {
  if (isFresh(cache.anonCookieHeader)) return cache.anonCookieHeader.value;
  const headers = new Headers();
  headers.set("User-Agent", UA_FP);
  const res = await fetch(URL_FINGERPRINT, { headers });
  const text = await res.text();
  const root = JSON.parse(text);
  const data = root?.data || {};
  const cookiePairs = [];
  const put = /* @__PURE__ */ __name((k, v) => {
    const val = (v || "").trim();
    if (val) cookiePairs.push(`${k}=${val}`);
  }, "put");
  put("buvid3", data.b_3 || data.buvid3);
  put("buvid4", data.b_4 || data.buvid4);
  put("buvid_fp", data.buvid_fp);
  put("buvid_fp_plain", data.buvid_fp_plain);
  put("b_lsid", data.b_lsid);
  const header = cookiePairs.join("; ");
  cache.anonCookieHeader = {
    value: header,
    cachedAt: nowMs(),
    ttlMs: 60 * 60 * 1e3
  };
  return header;
}
__name(getOrRefreshAnonCookieHeader, "getOrRefreshAnonCookieHeader");
async function signWbiUrl(baseUrl, paramsIn, cookieHeader) {
  const mk = await getOrRefreshMixinKey(cookieHeader);
  const params = /* @__PURE__ */ new Map();
  for (const [k, v] of Object.entries(paramsIn)) params.set(k, filterValue(v));
  params.set("wts", String(Math.floor(Date.now() / 1e3)));
  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const query = sorted.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
  const wRid = await md5Hex(query + mk);
  const url = new URL(baseUrl);
  for (const [k, v] of sorted) url.searchParams.set(k, v);
  url.searchParams.set("w_rid", wRid);
  return url.toString();
}
__name(signWbiUrl, "signWbiUrl");
async function forwardJsonWithWbi(request, env, upstreamBaseUrl, params) {
  const userCookie = readHeaderCookie(request);
  const cookie = userCookie || await getOrRefreshAnonCookieHeader();
  const signed = await signWbiUrl(upstreamBaseUrl, params, cookie);
  const headers = new Headers();
  headers.set("User-Agent", UA_PC);
  headers.set("Referer", REFERER);
  headers.set("Cookie", cookie);
  const res = await fetch(signed, { headers });
  const body = await res.text();
  const proxied = new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
  return withCors(request, env, proxied);
}
__name(forwardJsonWithWbi, "forwardJsonWithWbi");
async function cachedJson(request, env, cacheKeyUrl, ttlSeconds, fetcher) {
  const userCookie = readHeaderCookie(request);
  if (userCookie) return fetcher();
  const origin = request.headers.get("Origin") || "";
  const cacheUrl = new URL(cacheKeyUrl);
  cacheUrl.searchParams.set("_o", origin);
  const cache2 = globalThis.caches.default;
  const cacheReq = new Request(cacheUrl.toString(), { method: "GET" });
  const hit = await cache2.match(cacheReq);
  if (hit) return hit;
  const res = await fetcher();
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", `public, max-age=${ttlSeconds}`);
  const toCache = new Response(res.body, { status: res.status, headers });
  await cache2.put(cacheReq, toCache.clone());
  return toCache;
}
__name(cachedJson, "cachedJson");
function pickAudioUrl(playInfo, prefer) {
  const dash = playInfo?.data?.dash;
  const dolby = dash?.dolby;
  const flac = dash?.flac;
  const dashAudio = Array.isArray(dash?.audio) ? dash.audio : [];
  const dolbyAudio = Array.isArray(dolby?.audio) ? dolby.audio : [];
  const flacAudio = flac?.audio;
  const dashSorted = [...dashAudio].sort((a, b) => (b?.bandwidth || 0) - (a?.bandwidth || 0));
  const dolbySorted = [...dolbyAudio].sort((a, b) => (b?.bandwidth || 0) - (a?.bandwidth || 0));
  const pickDashByLevel = /* @__PURE__ */ __name((level) => {
    if (!dashSorted.length) return null;
    if (dashSorted.length === 1) return dashSorted[0]?.baseUrl || dashSorted[0]?.base_url || null;
    if (level === "high") return dashSorted[0]?.baseUrl || dashSorted[0]?.base_url || null;
    if (level === "low") return dashSorted[dashSorted.length - 1]?.baseUrl || dashSorted[dashSorted.length - 1]?.base_url || null;
    const mid = dashSorted[Math.floor(dashSorted.length / 2)];
    return mid?.baseUrl || mid?.base_url || null;
  }, "pickDashByLevel");
  if (prefer === "lossless") {
    const url = flacAudio?.baseUrl || flacAudio?.base_url;
    if (url) return url;
    return dolbySorted[0]?.baseUrl || dolbySorted[0]?.base_url || pickDashByLevel("high");
  }
  if (prefer === "dolby") {
    return dolbySorted[0]?.baseUrl || dolbySorted[0]?.base_url || pickDashByLevel("high");
  }
  if (prefer === "high" || prefer === "medium" || prefer === "low") {
    return pickDashByLevel(prefer);
  }
  const best = flacAudio?.baseUrl || flacAudio?.base_url || dolbySorted[0]?.baseUrl || dolbySorted[0]?.base_url || dashSorted[0]?.baseUrl || dashSorted[0]?.base_url;
  return best || null;
}
__name(pickAudioUrl, "pickAudioUrl");
function pickMp4Url(playInfo) {
  const durl = playInfo?.data?.durl;
  const first = Array.isArray(durl) ? durl[0] : null;
  return first?.url || null;
}
__name(pickMp4Url, "pickMp4Url");
async function proxyStream(request, env, upstreamUrl, cookieHeader) {
  const range = request.headers.get("Range");
  const headers = new Headers();
  headers.set("User-Agent", UA_PC);
  headers.set("Referer", REFERER);
  if (cookieHeader) headers.set("Cookie", cookieHeader);
  if (range) headers.set("Range", range);
  const upstreamRes = await fetch(upstreamUrl, { headers });
  const outHeaders = new Headers(upstreamRes.headers);
  outHeaders.set("Accept-Ranges", upstreamRes.headers.get("Accept-Ranges") || "bytes");
  outHeaders.delete("Set-Cookie");
  const response = new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: outHeaders
  });
  return withCors(request, env, response);
}
__name(proxyStream, "proxyStream");
async function handleAudio(request, env, url) {
  const bvid = url.searchParams.get("bvid") || "";
  const cid = url.searchParams.get("cid") || "";
  const prefer = url.searchParams.get("prefer") || "best";
  const mode = (url.searchParams.get("mode") || "dash").toLowerCase();
  const qn = url.searchParams.get("qn");
  const download = url.searchParams.get("download") === "1";
  const filename = (url.searchParams.get("filename") || "").trim();
  if (!bvid || !cid) return withCors(request, env, json({ error: "Missing bvid/cid" }, { status: 400 }));
  const userCookie = readHeaderCookie(request);
  const cookie = userCookie || await getOrRefreshAnonCookieHeader();
  const params = {
    bvid,
    cid,
    fnval: "272",
    fnver: "0",
    fourk: "0",
    otype: "json",
    platform: mode === "html5" ? "html5" : "pc"
  };
  if (qn) params.qn = qn;
  if (mode === "html5") {
    params.fnval = "0";
  }
  const signed = await signWbiUrl(URL_WBI_PLAYURL, params, cookie);
  const headers = new Headers();
  headers.set("User-Agent", UA_PC);
  headers.set("Referer", REFERER);
  headers.set("Cookie", cookie);
  const playRes = await fetch(signed, { headers });
  const playText = await playRes.text();
  const playJson = JSON.parse(playText);
  const upstreamUrl = mode === "html5" ? pickMp4Url(playJson) : pickAudioUrl(playJson, prefer);
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
    );
  }
  const proxied = await proxyStream(request, env, upstreamUrl, cookie);
  if (!download || !filename) return proxied;
  const headersOut = new Headers(proxied.headers);
  const safe = filename.replace(/[\\/:*?"<>|]+/g, " ").trim() || "bili-audio.mp4";
  headersOut.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`);
  return new Response(proxied.body, { status: proxied.status, headers: headersOut });
}
__name(handleAudio, "handleAudio");
function normalizeImageUrl(input) {
  const raw = (input || "").trim();
  if (!raw) return "";
  if (raw.startsWith("//")) return `https:${raw}`;
  if (raw.startsWith("http://")) return raw.replace("http://", "https://");
  return raw;
}
__name(normalizeImageUrl, "normalizeImageUrl");
function isAllowedImageHost(hostname) {
  const h = hostname.toLowerCase();
  return h === "hdslb.com" || h.endsWith(".hdslb.com");
}
__name(isAllowedImageHost, "isAllowedImageHost");
async function handleImage(request, env, url) {
  const target = normalizeImageUrl(url.searchParams.get("url") || "");
  if (!target) return withCors(request, env, json({ error: "Missing url" }, { status: 400 }));
  let u;
  try {
    u = new URL(target);
  } catch {
    return withCors(request, env, json({ error: "Invalid url" }, { status: 400 }));
  }
  if (u.protocol !== "https:" || !isAllowedImageHost(u.hostname)) {
    return withCors(request, env, json({ error: "Not allowed" }, { status: 403 }));
  }
  const origin = request.headers.get("Origin") || "";
  const cacheUrl = new URL(request.url);
  cacheUrl.searchParams.set("_o", origin);
  const cache2 = globalThis.caches.default;
  const cacheReq = new Request(cacheUrl.toString(), { method: "GET" });
  const hit = await cache2.match(cacheReq);
  if (hit) return withCors(request, env, hit);
  const headers = new Headers();
  headers.set("User-Agent", UA_PC);
  headers.set("Referer", REFERER);
  const res = await fetch(u.toString(), { headers });
  const outHeaders = new Headers(res.headers);
  outHeaders.delete("Set-Cookie");
  outHeaders.set("Cache-Control", "public, max-age=604800");
  const proxied = new Response(res.body, { status: res.status, headers: outHeaders });
  await cache2.put(cacheReq, proxied.clone());
  return withCors(request, env, proxied);
}
__name(handleImage, "handleImage");
function routeNotFound(request, env) {
  return withCors(request, env, json({ error: "Not found" }, { status: 404 }));
}
__name(routeNotFound, "routeNotFound");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    try {
      if (url.pathname === "/health") {
        return withCors(request, env, okText("ok"));
      }
      if (request.method !== "GET") {
        return withCors(request, env, json({ error: "Method not allowed" }, { status: 405 }));
      }
      if (url.pathname === "/api/bili/search") {
        const q = url.searchParams.get("q") || "";
        const page = url.searchParams.get("page") || "1";
        if (!q) return withCors(request, env, json({ error: "Missing q" }, { status: 400 }));
        return cachedJson(
          request,
          env,
          url.toString(),
          60,
          () => forwardJsonWithWbi(request, env, URL_WBI_SEARCH, {
            search_type: "video",
            keyword: q,
            page
          })
        );
      }
      if (url.pathname === "/api/bili/view") {
        const aid = url.searchParams.get("aid");
        const bvid = url.searchParams.get("bvid");
        if (!aid && !bvid) return withCors(request, env, json({ error: "Missing aid/bvid" }, { status: 400 }));
        const params = {};
        if (aid) params.aid = aid;
        if (bvid) params.bvid = bvid;
        return cachedJson(request, env, url.toString(), 3600, () => forwardJsonWithWbi(request, env, URL_WBI_VIEW, params));
      }
      if (url.pathname === "/api/bili/playurl") {
        const bvid = url.searchParams.get("bvid") || "";
        const cid = url.searchParams.get("cid") || "";
        const qn = url.searchParams.get("qn") || "";
        const mode = (url.searchParams.get("mode") || "dash").toLowerCase();
        if (!bvid || !cid) return withCors(request, env, json({ error: "Missing bvid/cid" }, { status: 400 }));
        const params = {
          bvid,
          cid,
          fnval: mode === "html5" ? "0" : "272",
          fnver: "0",
          fourk: "0",
          otype: "json",
          platform: mode === "html5" ? "html5" : "pc"
        };
        if (qn) params.qn = qn;
        return cachedJson(request, env, url.toString(), 30, () => forwardJsonWithWbi(request, env, URL_WBI_PLAYURL, params));
      }
      if (url.pathname === "/api/bili/image") {
        return handleImage(request, env, url);
      }
      if (url.pathname === "/api/bili/audio") {
        return handleAudio(request, env, url);
      }
      return routeNotFound(request, env);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return withCors(request, env, json({ error: "Internal error", message: msg }, { status: 500 }));
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-DewmVH/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-DewmVH/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
