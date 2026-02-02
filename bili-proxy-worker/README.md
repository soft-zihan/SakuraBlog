# B 站音乐解析/转发代理（Cloudflare Worker）

这个 Worker 用于在“纯静态前端（GitHub Pages）”环境下稳定播放 B 站音频：浏览器的 `<audio>` 不能自定义 `Referer/UA/Cookie`，而 B 站 upos/bilivideo 直链通常需要这些头部才能避免 403，因此需要一个转发层。

## 你需要准备什么

- 一个 Cloudflare 账号（免费）
- 本地安装 Node.js

不需要服务器、不需要公网 IP、不需要自己买域名。

## 费用说明（重要）

- Cloudflare Workers 默认有 Free 计划，不需要付费也能部署并使用（有免费额度）。官方说明与额度以 Cloudflare 文档为准：https://developers.cloudflare.com/workers/platform/pricing/

## 部署（最短流程）

1. 登录 Cloudflare → Workers & Pages
2. 本地安装依赖

```bash
cd bili-proxy-worker
npm i
```

3. 登录 Wrangler

```bash
npx wrangler login
```

4. 部署

```bash
npm run deploy
```

部署成功后 Cloudflare 会给你一个公网地址，形如：

`https://<worker-name>.<account>.workers.dev`

把这个地址填到前端的“音乐设置 → 解析服务地址”即可。

## 站点集成

本站已经集成代理。如果你想自己部署，可以把代理地址写到环境变量里，让所有访问者开箱即用：

- 在站点项目 `.env`（或部署环境变量）里设置：
  - `VITE_BILI_PROXY_BASE_URL=https://<worker-name>.<account>.workers.dev`
- 本项目已在 `.env.example` 里预留该字段。

## 接口

### 健康检查

- `GET /health` → `ok`

### 搜索视频（当作音乐条目）

- `GET /api/bili/search?q=<关键词>&page=1`

### 获取视频信息（用于拿 cid）

- `GET /api/bili/view?bvid=BV...` 或 `GET /api/bili/view?aid=123`

### 获取 playurl（调试用）

- `GET /api/bili/playurl?bvid=BV...&cid=...&mode=dash`
- `GET /api/bili/playurl?bvid=BV...&cid=...&mode=html5`

### 直接返回可播放音频（推荐给 `<audio src>` 用）

- `GET /api/bili/audio?bvid=BV...&cid=...&prefer=best`
- `GET /api/bili/audio?bvid=BV...&cid=...&mode=html5`
- 下载：`GET /api/bili/audio?...&download=1&filename=xxx.mp4`

`prefer` 可选：`lossless | dolby | high | medium | low | best`

### 图片代理（用于封面防盗链/跨域失败）

- `GET /api/bili/image?url=https%3A%2F%2Fi0.hdslb.com%2F...`

## Cookie（可选：需要登录内容时）

默认匿名也能搜索，部分内容无需登录即可播放。

若你需要登录态（例如私有收藏、部分限制内容），前端请求时可带自定义头：

- `X-Bili-Cookie: SESSDATA=...; bili_jct=...; DedeUserID=...`

该 Cookie 只会发给你自己部署的 Worker。

## CORS

默认 `ALLOW_ORIGIN` 是白名单（逗号分隔），见 `wrangler.toml`。建议只允许你自己的站点域名（以及本地开发域名）访问，避免被他人滥用。
