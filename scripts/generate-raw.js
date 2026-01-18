/**
 * 自动生成 /public/raw/ 目录下的源代码文本文件
 * 用于"查看源代码"功能
 * 
 * 运行: npm run gen-raw
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'raw');

// 需要生成的文件列表
const FILES_TO_GENERATE = [
  // 根目录文件
  'App.vue',
  'constants.ts',
  'types.ts',
  'vite.config.ts',
  'index.tsx',
  
  // components 目录下的所有 Vue 文件
  'components/AppHeader.vue',
  'components/AppSidebar.vue',
  'components/ArticleCard.vue',
  'components/BannerSettings.vue',
  'components/FileTree.vue',
  'components/FolderView.vue',
  'components/GiscusComments.vue',
  'components/GlobalAudio.vue',
  'components/LabAjax.vue',
  'components/LabClassStyle.vue',
  'components/LabCodeEvolution.vue',
  'components/LabDashboard.vue',
  'components/LabDirectives.vue',
  'components/LabDom.vue',
  'components/LabEventHandling.vue',
  'components/LabHtml.vue',
  'components/LabHtmlBasics.vue',
  'components/LabJs.vue',
  'components/LabLifecycle.vue',
  'components/LabPropsEmit.vue',
  'components/LabQuizGame.vue',
  'components/LabReactivity.vue',
  'components/LabSlot.vue',
  'components/LabVueList.vue',
  'components/MusicPlayer.vue',
  'components/PetalBackground.vue',
  'components/SearchModal.vue',
  'components/SettingsModal.vue',
  'components/WallpaperLayer.vue',
  'components/WriteEditor.vue',
  
  // composables
  'composables/useFile.ts',
  'composables/useGitHubPublish.ts',
  'composables/useMarkdown.ts',
  'composables/useSearch.ts',
  'composables/useWallpapers.ts',
  'composables/index.ts',
  
  // petal
  'components/petal/usePetals.ts',
  
  // stores
  'stores/appStore.ts',
  'stores/articleStore.ts',
  'stores/musicStore.ts',
  'stores/index.ts',
];

function generateRawFiles() {
  console.log('🔄 Generating raw source files...');
  
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 清理旧文件
  const existingFiles = fs.readdirSync(OUTPUT_DIR);
  for (const file of existingFiles) {
    if (file.endsWith('.txt')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const filePath of FILES_TO_GENERATE) {
    const sourcePath = path.join(ROOT_DIR, filePath);
    
    // 生成输出文件名：将路径中的 / 替换为 _
    const outputFileName = filePath.replace(/\//g, '_') + '.txt';
    const outputPath = path.join(OUTPUT_DIR, outputFileName);
    
    try {
      if (fs.existsSync(sourcePath)) {
        const content = fs.readFileSync(sourcePath, 'utf-8');
        fs.writeFileSync(outputPath, content, 'utf-8');
        console.log(`  ✅ ${filePath} -> ${outputFileName}`);
        successCount++;
      } else {
        console.log(`  ⚠️ File not found: ${filePath}`);
        failCount++;
      }
    } catch (error) {
      console.log(`  ❌ Error processing ${filePath}: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Summary: ${successCount} files generated, ${failCount} failed/skipped`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);
}

generateRawFiles();
