
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
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  
  // src 根目录
  'src/index.html',
  'src/App.vue',
  'src/main.ts',
  'src/constants.ts',
  'src/types.ts',
  
  // components 目录下的核心 Vue 文件
  'src/components/AppHeader.vue',
  'src/components/AppSidebar.vue',
  'src/components/ArticleCard.vue',
  'src/components/BannerSettings.vue',
  'src/components/FileTree.vue',
  'src/components/FloatingSelectionMenu.vue',
  'src/components/FolderView.vue',
  'src/components/GiscusComments.vue',
  'src/components/GlobalAudio.vue',
  'src/components/MainContent.vue',
  'src/components/MusicPlayer.vue',
  'src/components/PetalBackground.vue',
  'src/components/SearchModal.vue',
  'src/components/SettingsModal.vue',
  'src/components/WallpaperLayer.vue',
  'src/components/WelcomeScreen.vue',
  'src/components/WriteEditor.vue',
  
  // views
  'src/views/ArticleReader.vue',
  
  // lab 实验室组件
  'src/components/lab/LabDashboard.vue',
  'src/components/lab/SourceCodeViewer.vue',
  'src/components/lab/SourceFileTree.vue',
  'src/components/lab/CodeMinimap.vue',
  'src/components/lab/DualColumnView.vue',
  'src/components/lab/LabProjectTour.vue',
  'src/components/lab/PanelContent.vue',

  
  // lab/stage1-foundation
  'src/components/lab/stage1-foundation/LabCodeEvolution.vue',
  'src/components/lab/stage1-foundation/LabHtml.vue',
  'src/components/lab/stage1-foundation/LabHtmlBasics.vue',
  'src/components/lab/stage1-foundation/LabBrowserPipeline.vue',
  
  // lab/stage2-js-basics
  'src/components/lab/stage2-js-basics/LabJsBasics.vue',
  
  // lab/stage3-css
  'src/components/lab/stage3-css/LabCssBasics.vue',
  'src/components/lab/stage3-css/LabCssLayout.vue',
  'src/components/lab/stage3-css/LabCssAnimation.vue',
  'src/components/lab/stage3-css/LabCssPerformance.vue',
  
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
];

function generateRawFiles() {
  console.log('📝 Generating raw source files...');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  let count = 0;
  
  for (const file of FILES_TO_GENERATE) {
    const srcPath = path.join(ROOT_DIR, file);
    
    if (fs.existsSync(srcPath)) {
      // Flatten path structure: src/components/AppHeader.vue -> src_components_AppHeader.vue.txt
      const rawFileName = file.replace(/\//g, '_') + '.txt';
      const destPath = path.join(OUTPUT_DIR, rawFileName);
      
      try {
        fs.copyFileSync(srcPath, destPath);
        count++;
      } catch (err) {
        console.warn(`⚠️ Failed to copy ${file}:`, err);
      }
    } else {
      // console.warn(`⚠️ Source file not found: ${file}`);
    }
  }
  
  console.log(`✅ Generated ${count} raw files in ${OUTPUT_DIR}`);
}

generateRawFiles();
