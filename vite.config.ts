import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { setDefaultResultOrder } from 'node:dns'
import dns from 'node:dns'
import https from 'node:https'

setDefaultResultOrder('ipv4first')

const wallhavenLookup: https.AgentOptions['lookup'] = (hostname, options, callback) => {
  const wantAll =
    typeof options === 'object' &&
    options !== null &&
    'all' in options &&
    Boolean((options as any).all)

  dns.lookup(hostname, { family: 4, all: true }, (err, addresses) => {
    if (err) {
      callback(err as any, wantAll ? [] : (undefined as any), 4 as any)
      return
    }

    if (!addresses?.length) {
      const e = new Error(`DNS lookup returned no IPv4 addresses for ${hostname}`)
      callback(e as any, wantAll ? [] : (undefined as any), 4 as any)
      return
    }

    if (wantAll) {
      callback(null, addresses as any)
      return
    }

    const addr = addresses[Math.floor(Math.random() * addresses.length)]?.address
    if (!addr) {
      const e = new Error(`DNS lookup returned an invalid IPv4 address for ${hostname}`)
      callback(e as any, undefined as any, 4 as any)
      return
    }
    callback(null, addr, 4)
  })
}

const httpsAgent = new https.Agent({ lookup: wallhavenLookup })

export default defineConfig({
  root: 'src',
  envDir: '..',
  publicDir: '../public',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/wallhaven': {
        target: 'https://wallhaven.cc',
        changeOrigin: true,
        secure: true,
        agent: httpsAgent,
        timeout: 30000,
        proxyTimeout: 30000,
        rewrite: (path) => path.replace(/^\/api\/wallhaven/, '/api/v1')
      }
    }
  },
  preview: {
    proxy: {
      '/api/wallhaven': {
        target: 'https://wallhaven.cc',
        changeOrigin: true,
        secure: true,
        agent: httpsAgent,
        timeout: 30000,
        proxyTimeout: 30000,
        rewrite: (path) => path.replace(/^\/api\/wallhaven/, '/api/v1')
      }
    }
  },
  base: './',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
