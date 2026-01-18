
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <p class="text-xs text-gray-500 dark:text-gray-400 flex-1">{{ t.lab_html_info }}</p>
      
      <!-- View Mode Toggle -->
      <div class="bg-indigo-50 dark:bg-gray-900 p-1 rounded-lg flex gap-1 flex-shrink-0">
         <button 
           @click="viewMode = 'tree'"
           class="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1"
           :class="viewMode === 'tree' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
         >
           <span>🌳</span> {{ t.lab_html_debug }}
         </button>
         <button 
           @click="viewMode = 'preview'"
           class="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1"
           :class="viewMode === 'preview' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
         >
           <span>👁️</span> {{ t.lab_html_preview }}
         </button>
      </div>
    </div>

        <div class="flex flex-wrap items-center gap-3 mb-6">
            <div class="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-200 bg-indigo-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-indigo-100 dark:border-gray-700 shadow-sm">
                <span class="font-bold text-indigo-600 dark:text-indigo-300">{{ t.lab_html_tokens }}</span>
                <span class="px-2 py-1 rounded bg-white/80 dark:bg-gray-800/80 font-mono text-[11px] text-gray-700 dark:text-gray-100">{{ tokens.length }}</span>
                <span class="font-bold text-indigo-600 dark:text-indigo-300">DOM</span>
                <span class="px-2 py-1 rounded bg-white/80 dark:bg-gray-800/80 font-mono text-[11px] text-gray-700 dark:text-gray-100">{{ domNodeCount }}</span>
                <span class="text-[10px] text-gray-400 dark:text-gray-400">{{ viewMode === 'preview' ? t.lab_html_preview : t.lab_html_tree }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
                <button 
                    v-for="preset in presets" 
                    :key="preset.label"
                    @click="applyPreset(preset.code)"
                    class="px-3 py-1.5 text-xs rounded-lg border border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm text-gray-700 dark:text-gray-200"
                >
                    {{ preset.label }}
                </button>
                <button 
                    @click="resetToMinimal"
                    class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-400 text-gray-600 dark:text-gray-300 shadow-sm"
                >
                    Reset
                </button>
            </div>
        </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Editor Column -->
      <div class="flex flex-col h-[500px]">
        <div class="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold flex justify-between items-center border-b border-gray-700">
          <span class="text-[10px] bg-gray-700 px-2 py-0.5 rounded opacity-70">Raw HTML</span>
        </div>
        <textarea 
          v-model="htmlCode" 
          @input="parseHtml"
          class="w-full flex-1 bg-[#1e1e1e] text-blue-300 p-4 font-mono text-sm focus:outline-none resize-none shadow-inner custom-scrollbar leading-relaxed border-x border-gray-700"
          spellcheck="false"
        ></textarea>
        
        <!-- Token Stream Visualization (Mini) -->
        <div class="h-32 bg-[#252526] border border-gray-700 rounded-b-lg overflow-hidden flex flex-col">
            <div class="px-2 py-1 bg-black/20 text-[10px] text-gray-400 font-bold uppercase tracking-wider flex justify-between">
                <span>{{ t.lab_html_tokens }}</span>
                <span>{{ tokens.length }} Tokens</span>
            </div>
            <div class="flex-1 p-2 overflow-auto custom-scrollbar flex flex-wrap content-start gap-1">
                <div v-for="(tok, idx) in tokens" :key="idx" 
                     class="text-[10px] px-2 py-0.5 rounded border font-mono truncate max-w-[150px] transition-all duration-300 hover:scale-105 cursor-default"
                     :class="{
                        'bg-blue-900/40 text-blue-300 border-blue-800': tok.type === 'start',
                        'bg-red-900/40 text-red-300 border-red-800': tok.type === 'end',
                        'bg-gray-700 text-gray-300 border-gray-600': tok.type === 'text'
                     }"
                >
                    <span class="opacity-50 mr-1">{{ tok.type === 'start' ? '&lt;' : (tok.type === 'end' ? '&lt;/' : '#') }}</span>
                    {{ tok.name }}
                    <span class="opacity-50 ml-1">{{ tok.type === 'start' || tok.type === 'end' ? '&gt;' : '' }}</span>
                </div>
            </div>
        </div>
      </div>

      <!-- Visualization Column -->
      <div class="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-inner relative">
         
         <!-- Tree View -->
         <div v-if="viewMode === 'tree'" class="flex-1 overflow-auto custom-scrollbar p-6">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10">{{ t.lab_html_tree }}</h4>
            <div v-if="domTree" class="font-mono text-sm">
                <NodeTree :node="domTree" />
            </div>
            <div v-else class="text-gray-400 italic text-xs">Parse Error or Empty</div>
         </div>

         <!-- Real Preview -->
         <iframe 
            v-show="viewMode === 'preview'" 
            ref="sandboxIframe"
            class="w-full h-full border-none bg-white"
            sandbox="allow-scripts" 
         ></iframe>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { I18N } from '../constants';
import _ from 'lodash';
import { h } from 'vue';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);
const viewMode = ref<'tree' | 'preview'>('tree');
const htmlCode = ref(`<div class="card">
  <h3>Hello World</h3>
  <p>This is a <b>bold</b> statement.</p>
</div>`);

// Simple Tokenizer types
type TokenType = 'start' | 'end' | 'text';
interface Token {
    type: TokenType;
    name: string; // tag name or text content
}

interface DomNode {
    tag: string;
    text?: string;
    children: DomNode[];
}

const tokens = ref<Token[]>([]);
const domTree = ref<DomNode | null>(null);
const sandboxIframe = ref<HTMLIFrameElement | null>(null);

const countNodes = (node: DomNode | null): number => {
    if (!node) return 0;
    return 1 + node.children.reduce((acc, child) => acc + countNodes(child), 0);
};

const domNodeCount = computed(() => Math.max(countNodes(domTree.value) - 1, 0));

// A very basic HTML Tokenizer (Regex based for demo)
const tokenize = (html: string): Token[] => {
    const stream: Token[] = [];
    let buffer = html;
    
    // Simple regex for tags and text
    // Warning: This is a teaching simplifiction, not a spec-compliant parser
    const tagRegex = /^<(\/?)([a-z0-9]+)([^>]*)>/i;
    
    while (buffer.length > 0) {
        const match = buffer.match(tagRegex);
        
        if (match) {
            // It's a tag
            const isClosing = match[1] === '/';
            const tagName = match[2];
            stream.push({
                type: isClosing ? 'end' : 'start',
                name: tagName
            });
            buffer = buffer.slice(match[0].length);
        } else {
            // It's text until next tag
            const nextTagIndex = buffer.indexOf('<');
            let text = '';
            if (nextTagIndex === -1) {
                text = buffer;
                buffer = '';
            } else if (nextTagIndex === 0) {
                // Should not happen if regex works, but safe guard
                 buffer = buffer.slice(1);
            } else {
                text = buffer.slice(0, nextTagIndex);
                buffer = buffer.slice(nextTagIndex);
            }
            
            if (text.trim()) {
                stream.push({ type: 'text', name: text });
            }
        }
    }
    return stream;
};

// Build Tree from tokens
const buildTree = (tokens: Token[]): DomNode => {
    const root: DomNode = { tag: 'root', children: [] };
    const stack: DomNode[] = [root];
    
    tokens.forEach(token => {
        const currentParent = stack[stack.length - 1];
        
        if (token.type === 'start') {
            const newNode: DomNode = { tag: token.name, children: [] };
            currentParent.children.push(newNode);
            // Self-closing tags logic omitted for simplicity, assuming standard nesting
            if (!['img', 'br', 'hr', 'input'].includes(token.name.toLowerCase())) {
                 stack.push(newNode);
            }
        } else if (token.type === 'end') {
            // Pop until we find matching tag (simple error handling)
            if (stack.length > 1 && currentParent.tag === token.name) {
                stack.pop();
            }
        } else if (token.type === 'text') {
            currentParent.children.push({ tag: '#text', text: token.name, children: [] });
        }
    });
    
    return root;
};

const parseHtml = _.debounce(() => {
    try {
        const toks = tokenize(htmlCode.value);
        tokens.value = toks;
        domTree.value = buildTree(toks);
    } catch (e) {
        tokens.value = [];
        domTree.value = null;
        console.error("Parse Error", e);
    } finally {
        updateIframe();
    }
}, 300);

const updateIframe = () => {
    if (!sandboxIframe.value) return;
    const safeHtml = (htmlCode.value || '').trim() || '<p class="placeholder">⚠️ Empty input — nothing to render</p>';
    const styleBlock = `
        <style>
            :root { color-scheme: light; }
            body { font-family: 'Segoe UI', sans-serif; padding: 20px; color: #1f2937; line-height: 1.5; background: linear-gradient(135deg, #f8fafc, #eef2ff); }
            * { outline: 1px dashed rgba(0,0,0,0.08); }
            .placeholder { color: #9ca3af; font-style: italic; padding: 12px 16px; border: 1px dashed #d1d5db; background: #fff; border-radius: 12px; }
            .card { max-width: 320px; border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.12); padding: 16px; background: white; }
            h1, h2, h3, h4 { color: #111827; }
        </style>
    `;
    sandboxIframe.value.srcdoc = `${styleBlock}${safeHtml}`;
};

watch(viewMode, (mode) => {
    if (mode === 'preview') {
        nextTick(() => updateIframe());
    }
});

const presets = [
    {
        label: '语义化卡片',
        code: `<article class="card">
  <h2>Semantic Card</h2>
  <p>Combine <strong>structure</strong> with <em>emphasis</em>.</p>
  <button>Call To Action</button>
</article>`
    },
    {
        label: '表单结构',
        code: `<form class="card">
  <h3>Mini Form</h3>
  <label>Name <input placeholder="Jane" /></label>
  <label>Email <input type="email" placeholder="you@example.com" /></label>
  <button type="submit">Submit</button>
</form>`
    },
    {
        label: '列表与媒体',
        code: `<section class="card">
  <h3>Travel List</h3>
  <ul>
    <li>🗼 Tokyo</li>
    <li>🗽 New York</li>
    <li>🪩 Berlin</li>
  </ul>
  <img src="https://picsum.photos/320/140" alt="preview" />
</section>`
    }
];

const applyPreset = (code: string) => {
    htmlCode.value = code.trim();
    viewMode.value = 'preview';
    parseHtml();
};

const resetToMinimal = () => {
    htmlCode.value = `<div class="card">
  <h3>Hello World</h3>
  <p>This is a <b>bold</b> statement.</p>
</div>`;
    parseHtml();
};

// Recursive Tree Component using Functional Component pattern for recursion
const NodeTree = (props: { node: DomNode }) => {
    const { node } = props;
    if (node.tag === 'root') {
        return h('div', { class: 'pl-0' }, node.children.map(child => h(NodeTree, { node: child })));
    }
    if (node.tag === '#text') {
         return h('div', { class: 'ml-4 my-1 text-gray-500 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded inline-block border border-gray-200 dark:border-gray-700' }, `"${node.text}"`);
    }
    
    return h('div', { class: 'ml-4 my-2 border-l-2 border-indigo-200 dark:border-indigo-900 pl-2' }, [
        h('div', { class: 'font-bold text-indigo-600 dark:text-indigo-400 text-xs bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded inline-block' }, `<${node.tag}>`),
        h('div', {}, node.children.map(child => h(NodeTree, { node: child }))),
        h('div', { class: 'text-xs text-indigo-300 dark:text-indigo-800' }, `</${node.tag}>`)
    ]);
};

onMounted(() => {
    parseHtml();
});
</script>
