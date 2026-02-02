/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  interface Window {
    umami?: any
    __umamiSharePromise?: Promise<{ websiteId: string; token: string }>
    getUmamiShareData?: (baseUrl: string, shareId: string) => Promise<{ websiteId: string; token: string }>
    clearUmamiShareCache?: (shareId: string) => void
    fetchUmamiStats?: (baseUrl: string, shareId: string, queryParams?: Record<string, any>) => Promise<any>
    fetchUmamiMetricsExpanded?: (
      baseUrl: string,
      shareId: string,
      queryParams?: Record<string, any>
    ) => Promise<Array<{ name?: string; pageviews?: number; visitors?: number; visits?: number }>>
  }
}

export {}
