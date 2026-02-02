import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    include: ['tests/**/*.spec.ts'],
    globals: true,
    environment: 'jsdom', // 更改为jsdom环境以支持window对象
    setupFiles: ['./tests/setup.ts'], // 添加setup文件
  },
});
