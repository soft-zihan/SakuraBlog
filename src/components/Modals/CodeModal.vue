<template>
  <div 
    v-if="codeModal.showCodeModal.value" 
    class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4 md:p-10"
    @click.self="codeModal.closeCodeModal()"
  >
     <div class="bg-[#1e1e1e] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden relative transform transition-all duration-300 scale-100">
        <!-- Modal Header -->
        <div class="flex justify-between items-center px-6 py-4 bg-[#252526] border-b border-gray-700 shrink-0">
           <div class="flex items-center gap-2">
              <span class="text-2xl">📝</span>
              <div>
                 <h3 class="text-sm font-bold text-gray-200 font-mono">{{ codeModal.codeModalTitle.value }}</h3>
                 <span class="text-[10px] text-gray-500">{{ codeModal.codeModalPath.value || 'Read Only Preview' }}</span>
              </div>
           </div>
           <div class="flex gap-2">
             <button @click="handleCopy" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-600">Copy</button>
             <button @click="codeModal.closeCodeModal()" class="text-gray-400 hover:text-white transition-colors bg-gray-700/50 hover:bg-red-500/50 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
           </div>
        </div>
        <!-- Modal Content with Syntax Highlighting -->
        <div class="flex-1 overflow-auto custom-scrollbar p-0 bg-[#1e1e1e]">
           <pre class="p-6 text-sm font-mono leading-relaxed whitespace-pre-wrap hljs"><code v-html="sanitizedContent"></code></pre>
        </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCodeModal } from '../../composables/useCodeModal';
import { useAppStore } from '../../stores/appStore';
import { sanitizeHtml } from '../../utils/sanitize';

const props = defineProps<{
  t: any
}>();

const codeModal = useCodeModal();
const appStore = useAppStore();

const sanitizedContent = computed(() => {
  return sanitizeHtml(codeModal.highlightedCodeContent.value);
});

const showToast = (message: string) => {
  appStore.toastMessage = message;
  setTimeout(() => {
    appStore.toastMessage = '';
  }, 3000);
};

const handleCopy = () => {
  codeModal.copyCodeContent(showToast, props.t.toast_copied);
};
</script>
