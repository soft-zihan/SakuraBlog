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
  'src/App.vue',
  'src/constants.ts',
  'src/types.ts',
  'vite.config.ts',
  'src/main.ts',
  'src/index.html',
  'package.json',
  'tsconfig.json',
  
  // components 目录下的核心 Vue 文件
  'src/components/AppHeader.vue',
  'src/components/AppSidebar.vue',
  'src/components/ArticleCard.vue',
  'src/components/BannerSettings.vue',
  'src/components/FileTree.vue',
  'src/components/FolderView.vue',
  'src/components/GiscusComments.vue',
  'src/components/GlobalAudio.vue',
  'src/components/MusicPlayer.vue',
  'src/components/PetalBackground.vue',
  'src/components/SearchModal.vue',
  'src/components/SettingsModal.vue',
  'src/components/WallpaperLayer.vue',
  'src/components/WriteEditor.vue',
  
  // lab 实验室组件 - LabDashboard
  'src/components/lab/LabDashboard.vue',
  
  // lab/stage1-foundation
  'src/components/lab/stage1-foundation/LabCodeEvolution.vue',
  'src/components/lab/stage1-foundation/LabHtml.vue',
  'src/components/lab/stage1-foundation/LabHtmlBasics.vue',
  
  // lab/stage2-js-basics
  'src/components/lab/stage2-js-basics/LabJsBasics.vue',
  
  // lab/stage3-css
  'src/components/lab/stage3-css/LabCssBasics.vue',
  'src/components/lab/stage3-css/LabCssLayout.vue',
  'src/components/lab/stage3-css/LabCssAnimation.vue',
  
  // lab/stage4-js-advanced
  'src/components/lab/stage4-js-advanced/LabAjax.vue',
  'src/components/lab/stage4-js-advanced/LabAsync.vue',
  'src/components/lab/stage4-js-advanced/LabDom.vue',
  'src/components/lab/stage4-js-advanced/LabJs.vue',
  'src/components/lab/stage4-js-advanced/LabJsAdvanced.vue',
  'src/components/lab/stage4-js-advanced/LabTypeScript.vue',
  
  // lab/stage5-engineering
  'src/components/lab/stage5-engineering/LabBuildTools.vue',
  'src/components/lab/stage5-engineering/LabCssFrameworks.vue',
  'src/components/lab/stage5-engineering/LabModuleSystem.vue',
  'src/components/lab/stage5-engineering/LabNpm.vue',
  'src/components/lab/stage5-engineering/LabTailwind.vue',
  
  // lab/stage6-vue-core
  'src/components/lab/stage6-vue-core/LabClassStyle.vue',
  'src/components/lab/stage6-vue-core/LabDirectives.vue',
  'src/components/lab/stage6-vue-core/LabEventHandling.vue',
  'src/components/lab/stage6-vue-core/LabLifecycle.vue',
  'src/components/lab/stage6-vue-core/LabReactivity.vue',
  'src/components/lab/stage6-vue-core/LabVueList.vue',
  
  // lab/stage7-vue-advanced
  'src/components/lab/stage7-vue-advanced/LabComposables.vue',
  'src/components/lab/stage7-vue-advanced/LabPinia.vue',
  'src/components/lab/stage7-vue-advanced/LabPropsEmit.vue',
  'src/components/lab/stage7-vue-advanced/LabProvideInject.vue',
  'src/components/lab/stage7-vue-advanced/LabSlot.vue',
  
  // lab/stage8-challenge
  'src/components/lab/stage8-challenge/LabMiniProject.vue',
  'src/components/lab/stage8-challenge/LabQuizGame.vue',
  
  // composables
  'src/composables/useFile.ts',
  'src/composables/useGitHubPublish.ts',
  'src/composables/useMarkdown.ts',
  'src/composables/useSearch.ts',
  'src/composables/useWallpapers.ts',
  'src/composables/index.ts',
  'src/composables/useArticleMeta.ts',
  'src/composables/useBackup.ts',
  'src/composables/useCodeModal.ts',
  'src/composables/useContentClick.ts',
  'src/composables/useContentRenderer.ts',
  'src/composables/useLightbox.ts',
  'src/composables/useRawEditor.ts',
  'src/composables/useSelectionMenu.ts',
  'src/composables/useTokenSecurity.ts',
  
  // petal
  'src/components/petal/usePetals.ts',
  
  // stores
  'src/stores/appStore.ts',
  'src/stores/articleStore.ts',
  'src/stores/learningStore.ts',
  'src/stores/musicStore.ts',
  'src/stores/index.ts',
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
