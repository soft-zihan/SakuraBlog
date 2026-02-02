
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '../src/stores/appStore';

// Mock Image globally
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
  naturalWidth: number = 0;
  naturalHeight: number = 0;

  constructor() {
    setTimeout(() => {
        if (this.src.includes('invalid')) {
            if (this.onerror) this.onerror();
        } else if (this.src.includes('small')) {
            this.naturalWidth = 100;
            this.naturalHeight = 100;
            if (this.onload) this.onload();
        } else {
            this.naturalWidth = 1920;
            this.naturalHeight = 1080;
            if (this.onload) this.onload();
        }
    }, 10);
  }
}

// Mock IndexedDB
const mockTransaction = {
  objectStore: vi.fn().mockReturnValue({
    put: vi.fn().mockImplementation(() => {
        const req = { onsuccess: null, onerror: null };
        setTimeout(() => req.onsuccess && req.onsuccess({} as any), 0);
        return req;
    }),
    get: vi.fn().mockImplementation(() => {
        const req = { onsuccess: null, onerror: null, result: undefined };
        setTimeout(() => req.onsuccess && req.onsuccess({ target: { result: undefined } } as any), 0);
        return req;
    })
  })
};

const mockDB = {
  transaction: vi.fn().mockReturnValue(mockTransaction),
  objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
  createObjectStore: vi.fn()
};

const mockIndexedDB = {
  open: vi.fn().mockImplementation(() => {
    const req = { onsuccess: null, onerror: null, onupgradeneeded: null, result: mockDB };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: { result: mockDB } } as any), 0);
    return req;
  })
};

describe('Wallpaper System', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
    (global as any).Image = MockImage;
    (global as any).indexedDB = mockIndexedDB;
    
    // Default mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ light: [], dark: [] }),
      blob: async () => new Blob(['test'], { type: 'image/jpeg' })
    } as any);
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
     vi.restoreAllMocks();
  });

  it('fetchBaiduWallpaper fetches double the requested limit', async () => {
    const { useWallpapers } = await import('../src/composables/useWallpapers');
    const { fetchBaiduWallpaper } = useWallpapers();
    
    (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
            code: 200,
            res: Array(10).fill('http://example.com/valid.jpg').map((u, i) => `${u}?id=${i}`)
        })
    });

    await fetchBaiduWallpaper('test', 5);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
  });

  it('fetchBaiduWallpaper filters out invalid images', async () => {
    const { useWallpapers } = await import('../src/composables/useWallpapers');
    const { fetchBaiduWallpaper, baiduWallpapers } = useWallpapers();

    (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
            code: 200,
            res: [
                'http://example.com/valid1.jpg',
                'http://example.com/invalid1.jpg', 
                'http://example.com/small.jpg',   
                'http://example.com/valid2.jpg'
            ]
        })
    });

    await fetchBaiduWallpaper('test', 2);
    
    expect(baiduWallpapers.value.length).toBe(2);
    expect(baiduWallpapers.value.map(w => w.path)).toEqual([
        'http://example.com/valid1.jpg', 
        'http://example.com/valid2.jpg'
    ]);
  });
  
  it('addCustomWallpaper caches image', async () => {
      const { useWallpapers } = await import('../src/composables/useWallpapers');
      const { addCustomWallpaper } = useWallpapers();
      
      const payload = { name: 'Test', url: 'http://example.com/test.jpg', source: 'url' as const };
      
      await addCustomWallpaper(payload);
      
      // Should verify cacheBlob was called. 
      // Since cacheBlob is internal, we check if IndexedDB was accessed.
      expect(mockIndexedDB.open).toHaveBeenCalled();
  });

  it('autoChangeWallpaper returns false when no valid wallpaper found', async () => {
    const appStore = useAppStore();
    appStore.userSettings.autoChangeMode = 'preset';

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        light: [{ filename: 'invalid.jpg', path: 'invalid.jpg', name: 'Invalid' }],
        dark: []
      })
    });

    const { useWallpapers } = await import('../src/composables/useWallpapers');
    const { loadWallpapers, autoChangeWallpaper } = useWallpapers();

    await loadWallpapers();
    const result = await autoChangeWallpaper(true, 'preset');

    expect(result).toBe(false);
    expect(appStore.currentWallpaperFilename).toBe('');
  });
});
