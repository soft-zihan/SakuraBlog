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
  'index.html',
  'package.json',
  'tsconfig.json',
  
  // components 目录下的核心 Vue 文件
  'components/AppHeader.vue',
  'components/AppSidebar.vue',
  'components/ArticleCard.vue',
  'components/BannerSettings.vue',
  'components/FileTree.vue',
  'components/FolderView.vue',
  'components/GiscusComments.vue',
  'components/GlobalAudio.vue',
  'components/MusicPlayer.vue',
  'components/PetalBackground.vue',
  'components/SearchModal.vue',
  'components/SettingsModal.vue',
  'components/WallpaperLayer.vue',
  'components/WriteEditor.vue',
  
  // lab 实验室组件 - LabDashboard
  'components/lab/LabDashboard.vue',
  
  // lab/stage1-foundation
  'components/lab/stage1-foundation/LabCodeEvolution.vue',
  'components/lab/stage1-foundation/LabHtml.vue',
  'components/lab/stage1-foundation/LabHtmlBasics.vue',
  
  // lab/stage2-js-basics
  'components/lab/stage2-js-basics/LabJsBasics.vue',
  
  // lab/stage3-css
  'components/lab/stage3-css/LabCssBasics.vue',
  'components/lab/stage3-css/LabCssLayout.vue',
  'components/lab/stage3-css/LabCssAnimation.vue',
  
  // lab/stage4-js-advanced
  'components/lab/stage4-js-advanced/LabAjax.vue',
  'components/lab/stage4-js-advanced/LabAsync.vue',
  'components/lab/stage4-js-advanced/LabDom.vue',
  'components/lab/stage4-js-advanced/LabJs.vue',
  'components/lab/stage4-js-advanced/LabJsAdvanced.vue',
  'components/lab/stage4-js-advanced/LabTypeScript.vue',
  
  // lab/stage5-engineering
  'components/lab/stage5-engineering/LabBuildTools.vue',
  'components/lab/stage5-engineering/LabCssFrameworks.vue',
  'components/lab/stage5-engineering/LabModuleSystem.vue',
  'components/lab/stage5-engineering/LabNpm.vue',
  'components/lab/stage5-engineering/LabTailwind.vue',
  
  // lab/stage6-vue-core
  'components/lab/stage6-vue-core/LabClassStyle.vue',
  'components/lab/stage6-vue-core/LabDirectives.vue',
  'components/lab/stage6-vue-core/LabEventHandling.vue',
  'components/lab/stage6-vue-core/LabLifecycle.vue',
  'components/lab/stage6-vue-core/LabReactivity.vue',
  'components/lab/stage6-vue-core/LabVueList.vue',
  
  // lab/stage7-vue-advanced
  'components/lab/stage7-vue-advanced/LabComposables.vue',
  'components/lab/stage7-vue-advanced/LabPinia.vue',
  'components/lab/stage7-vue-advanced/LabPropsEmit.vue',
  'components/lab/stage7-vue-advanced/LabProvideInject.vue',
  'components/lab/stage7-vue-advanced/LabSlot.vue',
  
  // lab/stage8-challenge
  'components/lab/stage8-challenge/LabMiniProject.vue',
  'components/lab/stage8-challenge/LabQuizGame.vue',
  
  // composables
  'composables/useFile.ts',
  'composables/useGitHubPublish.ts',
  'composables/useMarkdown.ts',
  'composables/useSearch.ts',
  'composables/useWallpapers.ts',
  'composables/index.ts',
  'composables/useArticleMeta.ts',
  'composables/useBackup.ts',
  'composables/useCodeModal.ts',
  'composables/useContentClick.ts',
  'composables/useContentRenderer.ts',
  'composables/useLightbox.ts',
  'composables/useRawEditor.ts',
  'composables/useSelectionMenu.ts',
  'composables/useTokenSecurity.ts',
  
  // petal
  'components/petal/usePetals.ts',
  
  // stores
  'stores/appStore.ts',
  'stores/articleStore.ts',
  'stores/learningStore.ts',
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
