
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-yellow-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
    
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
      <button 
        @click="activeTab = 'basics'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all"
        :class="activeTab === 'basics' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'"
      >
        {{ t.lab_js_tab_basics }}
      </button>
      <button 
        @click="activeTab = 'coercion'"
        class="px-4 py-2 text-xs font-bold rounded-lg transition-all"
        :class="activeTab === 'coercion' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'"
      >
        {{ t.lab_js_tab_coercion }}
      </button>
    </div>

    <!-- Tab 1: Real JS Runtime (REPL) -->
    <div v-if="activeTab === 'basics'" class="animate-fade-in space-y-4">
       <p class="text-xs text-gray-500 dark:text-gray-400">
         {{ t.lab_js_info }}
       </p>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
          <!-- Input Area -->
          <div class="flex flex-col h-full">
             <div class="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold">Code Input</div>
             <textarea 
               v-model="jsCode" 
               class="flex-1 bg-[#1e1e1e] text-yellow-100 p-4 font-mono text-sm focus:outline-none resize-none shadow-inner custom-scrollbar border-x border-b border-gray-700 rounded-b-lg leading-relaxed"
               placeholder="// Try typing:
let a = 10;
let b = '20';
console.log(a + b);
console.log([] == ![]);"
               spellcheck="false"
             ></textarea>
             <button @click="runCode" class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-xl transition-all shadow-lg active:scale-95">
                ⚡ {{ t.lab_js_run }}
             </button>
          </div>

          <!-- Console Output -->
          <div class="flex flex-col h-full">
             <div class="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg font-bold flex justify-between">
                <span>{{ t.lab_js_console }}</span>
                <span @click="logs = []" class="cursor-pointer hover:text-white">🗑️</span>
             </div>
             <div class="flex-1 bg-black text-green-400 p-4 font-mono text-xs overflow-auto custom-scrollbar rounded-b-lg shadow-inner border border-gray-700">
                <div v-for="(log, i) in logs" :key="i" class="mb-1 border-b border-gray-800/50 pb-1">
                   <span class="opacity-50 select-none mr-2">></span>
                   <span :class="log.type === 'error' ? 'text-red-400' : 'text-green-400'">{{ log.msg }}</span>
                </div>
                <div v-if="logs.length === 0" class="text-gray-600 italic">// Console is empty</div>
             </div>
          </div>
       </div>
    </div>

    <!-- Tab 2: Type Coercion Matrix -->
    <div v-else-if="activeTab === 'coercion'" class="animate-fade-in">
       <div class="overflow-x-auto">
         <table class="w-full text-xs text-center border-collapse">
            <thead>
               <tr>
                 <th class="p-2 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">==</th>
                 <th v-for="type in coercionTypes" :key="type" class="p-2 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 font-mono text-purple-600 dark:text-purple-400">{{ type }}</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="rowType in coercionTypes" :key="rowType">
                  <td class="p-2 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 font-mono text-blue-600 dark:text-blue-400 font-bold text-right">{{ rowType }}</td>
                  <td v-for="colType in coercionTypes" :key="colType" 
                      class="p-2 border dark:border-gray-600 font-mono transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-help"
                      :class="checkEquality(rowType, colType) ? 'bg-green-50 dark:bg-green-900/30 text-green-600' : 'text-red-300 opacity-50'"
                      :title="`${rowType} == ${colType}`"
                  >
                     {{ checkEquality(rowType, colType) }}
                  </td>
               </tr>
            </tbody>
         </table>
       </div>
       <div class="mt-4 text-xs text-gray-500 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <strong>Tip:</strong> This matrix shows the result of loose equality (`==`) in JavaScript. Green means `true`.
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N } from '../../../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);
const activeTab = ref<'basics' | 'coercion'>('basics');
const jsCode = ref(`const a = [1, 2];
const b = [1, 2];

console.log("a == b?", a == b);
console.log("a === b?", a === b);
console.log("Typeof null:", typeof null);`);
const logs = ref<{msg: string, type: 'log' | 'error'}[]>([]);

// REPL Logic
const runCode = () => {
    logs.value = [];
    const env: Record<string, unknown> = {};

    const splitArgs = (input: string) => {
        const out: string[] = [];
        let cur = '';
        let quote: '"' | "'" | null = null;
        let depth = 0;
        for (let i = 0; i < input.length; i++) {
            const ch = input[i];
            if (quote) {
                cur += ch;
                if (ch === quote && input[i - 1] !== '\\') quote = null;
                continue;
            }
            if (ch === '"' || ch === "'") {
                quote = ch;
                cur += ch;
                continue;
            }
            if (ch === '[' || ch === '{' || ch === '(') depth++;
            if (ch === ']' || ch === '}' || ch === ')') depth = Math.max(0, depth - 1);
            if (ch === ',' && depth === 0) {
                out.push(cur.trim());
                cur = '';
                continue;
            }
            cur += ch;
        }
        if (cur.trim()) out.push(cur.trim());
        return out;
    };

    const parseArrayNumbers = (raw: string) => {
        const m = /^\[\s*([^\]]*)\s*\]$/.exec(raw.trim());
        if (!m) return null;
        const inner = m[1].trim();
        if (!inner) return [];
        const parts = inner.split(',').map(s => s.trim()).filter(Boolean);
        const nums = parts.map(p => Number(p));
        if (nums.some(n => !Number.isFinite(n))) return null;
        return nums;
    };

    const parseStringLiteral = (raw: string) => {
        const m = /^(["'])([\s\S]*)\1$/.exec(raw.trim());
        if (!m) return null;
        return m[2];
    };

    const evalAtom = (raw: string): unknown => {
        const s = raw.trim();
        if (s in env) return env[s];
        if (s === 'null') return null;
        if (s === 'undefined') return undefined;
        if (s === 'true') return true;
        if (s === 'false') return false;
        const arr = parseArrayNumbers(s);
        if (arr !== null) return arr;
        const str = parseStringLiteral(s);
        if (str !== null) return str;
        if (/^[-+]?\d+(\.\d+)?$/.test(s)) return Number(s);
        return undefined;
    };

    const evalExpr = (raw: string): unknown => {
        const s = raw.trim();
        const typeofMatch = /^typeof\s+(.+)$/.exec(s);
        if (typeofMatch) return typeof evalAtom(typeofMatch[1]);

        const eqMatch = /^(.+?)\s*(==|===)\s*(.+)$/.exec(s);
        if (eqMatch) {
            const left = evalAtom(eqMatch[1]);
            const right = evalAtom(eqMatch[3]);
            return eqMatch[2] === '===' ? left === right : (left as any) == (right as any);
        }

        return evalAtom(s);
    };

    const pushLog = (...args: unknown[]) => {
        logs.value.push({
            msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
            type: 'log'
        });
    };

    const pushError = (msg: unknown) => {
        logs.value.push({ msg: String(msg), type: 'error' });
    };

    const lines = jsCode.value.replace(/\r\n/g, '\n').split('\n');
    try {
        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;
            if (line.startsWith('//')) continue;

            const assign = /^const\s+([A-Za-z_$][\w$]*)\s*=\s*(.+?);?$/.exec(line);
            if (assign) {
                const name = assign[1];
                const rhs = assign[2];
                env[name] = evalExpr(rhs);
                continue;
            }

            const logCall = /^console\.log\((.*)\);?$/.exec(line);
            if (logCall) {
                const args = splitArgs(logCall[1]).map(a => evalExpr(a));
                pushLog(...args);
                continue;
            }

            pushError(`Unsupported: ${line}`);
        }
    } catch (e: any) {
        pushError(e?.message || e);
    }
};

// Coercion Matrix Logic
const coercionTypes = ['true', 'false', '1', '0', '-1', '"true"', '"false"', '"1"', '"0"', '""', 'null', 'undefined', '[]', '{}'];

const parseValue = (str: string): any => {
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (str === 'null') return null;
    if (str === 'undefined') return undefined;
    if (str === '[]') return [];
    if (str === '{}') return {};
    if (str.startsWith('"')) return str.slice(1, -1);
    return Number(str);
}

const checkEquality = (aStr: string, bStr: string) => {
    try {
        const a = parseValue(aStr);
        const b = parseValue(bStr);
        // Loose equality check
        return a == b;
    } catch (e) {
        return false;
    }
}
</script>
