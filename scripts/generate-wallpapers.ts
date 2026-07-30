
/**
 * 自动扫描 /public/image/light/ 和 /public/image/dark/ 目录生成 wallpapers.json
 * 
 * 运行: npm run gen-wallpapers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const LIGHT_DIR = path.join(ROOT_DIR, 'public', 'image', 'light');
const DARK_DIR = path.join(ROOT_DIR, 'public', 'image', 'dark');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'wallpapers.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

interface Wallpaper {
  filename: string;
  path: string;
  name: string;
}

interface WallpapersData {
  _comment: string;
  _generated: string;
  light: Wallpaper[];
  dark: Wallpaper[];
}

function generateWallpapersJson() {
  console.log('🖼️ Scanning wallpaper directories...');
  
  // 确保目录存在
  if (!fs.existsSync(LIGHT_DIR)) {
    console.log('⚠️ Light wallpaper directory not found, creating...');
    fs.mkdirSync(LIGHT_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(DARK_DIR)) {
    console.log('⚠️ Dark wallpaper directory not found, creating...');
    fs.mkdirSync(DARK_DIR, { recursive: true });
  }
  
  // 扫描亮色主题壁纸
  const lightFiles: Wallpaper[] = fs.readdirSync(LIGHT_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .map(file => ({
      filename: file,
      path: `/image/light/${file}`,
      name: file.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '').replace(/[-_]/g, ' ')
    }));
  
  // 扫描暗色主题壁纸
  const darkFiles: Wallpaper[] = fs.readdirSync(DARK_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .map(file => ({
      filename: file,
      path: `/image/dark/${file}`,
      name: file.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '').replace(/[-_]/g, ' ')
    }));
  
  console.log(`  Found ${lightFiles.length} light wallpaper(s)`);
  console.log(`  Found ${darkFiles.length} dark wallpaper(s)`);
  
  // 生成输出
  const output: WallpapersData = {
    _comment: "此文件由 scripts/generate-wallpapers.ts 自动生成，请勿手动编辑",
    _generated: new Date().toISOString(),
    light: lightFiles,
    dark: darkFiles
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✅ Generated wallpapers.json with ${lightFiles.length} light + ${darkFiles.length} dark wallpapers`);
}

generateWallpapersJson();
