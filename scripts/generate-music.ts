
/**
 * 自动扫描 /public/music/ 目录生成 music.json
 * 封面图片自动使用 music/cover/ 下的同名图片
 * 
 * 运行: npm run gen-music
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const MUSIC_DIR = path.join(ROOT_DIR, 'public', 'music');
const COVER_DIR = path.join(MUSIC_DIR, 'cover');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'music.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 支持的音频格式
const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.m4s', '.ogg', '.wav', '.flac', '.aac', '.webm'];

// 支持的封面图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

interface Track {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

function generateMusicJson() {
  console.log('🎵 Scanning music directory...');
  
  // 确保音乐目录存在
  if (!fs.existsSync(MUSIC_DIR)) {
    console.log('⚠️ Music directory not found, creating...');
    fs.mkdirSync(MUSIC_DIR, { recursive: true });
  }
  
  // 确保封面目录存在
  if (!fs.existsSync(COVER_DIR)) {
    fs.mkdirSync(COVER_DIR, { recursive: true });
  }
  
  // 扫描音乐文件
  const files = fs.readdirSync(MUSIC_DIR);
  let coverFiles: string[] = [];
  try {
    coverFiles = fs.readdirSync(COVER_DIR);
  } catch (e) {
    // cover dir might be empty
  }
  
  const tracks: Track[] = [];
  
  for (const file of files) {
    const filePath = path.join(MUSIC_DIR, file);
    const stat = fs.statSync(filePath);
    
    // 跳过目录
    if (stat.isDirectory()) continue;
    
    const ext = path.extname(file).toLowerCase();
    
    // 检查是否是支持的音频格式
    if (!AUDIO_EXTENSIONS.includes(ext)) continue;
    
    const baseName = path.basename(file, ext);
    
    // 解析文件名，格式支持: "歌名-歌手" 或 "歌名"
    let title = baseName;
    let artist = 'Unknown';
    
    const dashIndex = baseName.lastIndexOf('-');
    if (dashIndex > 0) {
      title = baseName.substring(0, dashIndex).trim();
      artist = baseName.substring(dashIndex + 1).trim();
    }
    
    // 查找封面图片（同名、大小写不敏感、或含音频扩展名）
    let cover: string | null = null;
    const candidates = [baseName, file]; // file 可能用于 cover 为 “歌名-歌手.mp3.jpg” 的场景
    const normalizedCandidates = candidates.map(c => c.toLowerCase());
    
    for (const coverFile of coverFiles) {
      const coverExt = path.extname(coverFile).toLowerCase();
      if (!IMAGE_EXTENSIONS.includes(coverExt)) continue;
      const coverBase = path.basename(coverFile, coverExt);
      const coverBaseLower = coverBase.toLowerCase();
      
      if (normalizedCandidates.includes(coverBaseLower)) {
        cover = `./music/cover/${coverFile}`;
        break;
      }
    }
    
    // 如果没有专属封面，使用默认封面
    if (!cover) {
      // 检查是否有 default 封面
      for (const imgExt of IMAGE_EXTENSIONS) {
        const defaultCover = path.join(COVER_DIR, 'default' + imgExt);
        if (fs.existsSync(defaultCover)) {
          cover = `./music/cover/default${imgExt}`;
          break;
        }
      }
    }
    
    tracks.push({
      title,
      artist,
      url: `./music/${file}`,
      cover: cover || './image/default-cover.jpg' // Fallback
    });
  }
  
  console.log(`  Found ${tracks.length} track(s)`);
  
  // 生成输出
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tracks, null, 2), 'utf-8');
  console.log(`✅ Generated music.json with ${tracks.length} tracks`);
}

generateMusicJson();
