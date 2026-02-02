import { vi } from 'vitest';

// 模拟 window 对象
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    search: '',
    pathname: '/',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    state: {},
  },
  writable: true,
});

// 模拟 ResizeObserver
window.ResizeObserver = window.ResizeObserver || vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// 模拟 IntersectionObserver
window.IntersectionObserver = window.IntersectionObserver || vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));