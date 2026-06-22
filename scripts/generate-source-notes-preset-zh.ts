import fs from 'fs';
import path from 'path';

type PresetNote = {
  line?: number;
  content?: string;
  match?: string;
  matchRegex?: string;
  occurrence?: number;
  offset?: number;
};

type PerFilePreset = {
  intro: string;
  notes: PresetNote[];
};

const rootDir = process.cwd();
const presetDir = path.join(rootDir, 'public', 'data', 'source-notes-preset', 'zh');

const toPosixPath = (p: string) => p.replace(/\\/g, '/');

const walkFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(abs));
    else out.push(abs);
  }
  return out;
};

const splitLines = (text: string): string[] => text.split(/\r?\n/);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeLineForAnchor = (line: string) => line.replace(/\s+$/, '');

const buildAnchor = (line: string): Pick<PresetNote, 'match' | 'matchRegex'> | null => {
  const normalized = normalizeLineForAnchor(line);
  if (!normalized.trim()) return null;
  if (normalized.length <= 180) return { matchRegex: `^${escapeRegex(normalized)}\\s*$` };
  return { match: normalized.slice(0, 140) };
};

const countMatches = (lines: string[], anchor: Pick<PresetNote, 'match' | 'matchRegex'>): number => {
  if ('matchRegex' in anchor && anchor.matchRegex) {
    let re: RegExp;
    try {
      re = new RegExp(anchor.matchRegex);
    } catch {
      return 0;
    }
    let c = 0;
    for (const l of lines) if (re.test(l)) c++;
    return c;
  }
  if ('match' in anchor && anchor.match) {
    let c = 0;
    for (const l of lines) if (l.includes(anchor.match)) c++;
    return c;
  }
  return 0;
};

const computeOccurrenceForLine = (
  lines: string[],
  anchor: Pick<PresetNote, 'match' | 'matchRegex'>,
  lineIndex: number
): number => {
  const end = Math.min(Math.max(0, Math.floor(lineIndex)), Math.max(0, lines.length - 1));

  if (anchor.matchRegex) {
    const re = new RegExp(anchor.matchRegex);
    let hit = 0;
    for (let i = 0; i <= end; i++) {
      if (re.test(lines[i] ?? '')) hit++;
    }
    return Math.max(1, hit);
  }

  if (anchor.match) {
    let hit = 0;
    for (let i = 0; i <= end; i++) {
      if ((lines[i] ?? '').includes(anchor.match)) hit++;
    }
    return Math.max(1, hit);
  }

  return 1;
};

const addAnchoredNote = (
  notes: PresetNote[],
  lines: string[],
  lineIndex: number,
  content: string
) => {
  if (!content.trim()) return;
  const line = lines[lineIndex] ?? '';
  const anchor = buildAnchor(line);
  if (!anchor) return;

  const matchCount = countMatches(lines, anchor);
  const occurrence = matchCount > 1 ? computeOccurrenceForLine(lines, anchor, lineIndex) : undefined;

  const next: PresetNote = {
    ...anchor,
    occurrence,
    content: content.trim()
  };

  const anchorKey = JSON.stringify({
    match: next.match,
    matchRegex: next.matchRegex,
    occurrence: next.occurrence,
    offset: next.offset
  });

  const existingIdx = notes.findIndex(n => JSON.stringify({
    match: n.match,
    matchRegex: n.matchRegex,
    occurrence: n.occurrence,
    offset: n.offset
  }) === anchorKey);

  if (existingIdx < 0) {
    notes.push(next);
    return;
  }

  const prev = (notes[existingIdx].content ?? '').trim();
  const cur = next.content?.trim() ?? '';
  if (!cur) return;

  if (!prev) {
    notes[existingIdx].content = cur;
    return;
  }

  if (prev === cur) return;
  if (cur.includes(prev) && cur.length > prev.length) {
    notes[existingIdx].content = cur;
    return;
  }
  if (prev.includes(cur)) return;

  notes[existingIdx].content = `${prev}\n\n${cur}`;
};

const findFirstIndex = (lines: string[], pred: (line: string) => boolean) => {
  for (let i = 0; i < lines.length; i++) if (pred(lines[i])) return i;
  return -1;
};

const extOf = (sourceRel: string) => {
  const base = path.basename(sourceRel);
  if (base.startsWith('.') && !base.includes('.', 1)) return base;
  return path.extname(sourceRel).toLowerCase();
};

const buildIntro = (sourceRel: string, ext: string) => {
  const name = toPosixPath(sourceRel);
  if (ext === '.vue') return `组件源码：${name}。预置笔记聚焦 Vue 模板/脚本的语法写法、指令形态与常见边界。`;
  if (ext === '.ts') return `TypeScript 源码：${name}。预置笔记聚焦 import/export、类型声明、泛型、异步与常用语法符号。`;
  if (ext === '.css') return `样式源码：${name}。预置笔记聚焦选择器、层叠/优先级、@media、CSS 变量与常见布局/动画语法。`;
  if (ext === '.md') return `Markdown 文档：${name}。预置笔记聚焦 Markdown 基本语法（标题、列表、链接、代码块）与书写规范。`;
  if (ext === '.json') return `JSON 配置/数据：${name}。预置笔记聚焦 JSON 语法约束（双引号、无注释、无尾逗号）与常见结构。`;
  if (ext === '.d.ts') return `声明文件：${name}。预置笔记聚焦 TypeScript 声明语法（declare、模块声明、类型导出）。`;
  if (ext === '.env' || ext === '.env.example') return `环境变量示例：${name}。预置笔记聚焦 KEY=VALUE 语法、VITE_ 约定与常见坑位。`;
  return `源码文件：${name}。预置笔记聚焦本文件中出现的关键语法写法与边界。`;
};

const generateNotesForVue = (sourceRel: string, lines: string[], notes: PresetNote[]) => {
  const idxTemplate = findFirstIndex(lines, l => l.trim() === '<template>');
  if (idxTemplate >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxTemplate,
      '<template>：模板语法只允许写表达式（如三元、??、?.），不允许写 if/for 语句块或赋值语句。'
    );
  }

  const idxScriptSetup = findFirstIndex(lines, l => /^<script\s+setup\b/.test(l.trim()));
  if (idxScriptSetup >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxScriptSetup,
      '<script setup>：Composition API 的语法糖。顶层变量/函数会自动暴露给模板；lang="ts" 表示脚本用 TypeScript 编译。'
    );
  }

  const idxDefineProps = findFirstIndex(lines, l => l.includes('defineProps<') || l.includes('defineProps('));
  if (idxDefineProps >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxDefineProps,
      'defineProps：定义组件输入。常见写法是 defineProps<{ ... }>() 用泛型标注 props 类型；字面量联合（\'en\'|\'zh\'）能限制取值集合。'
    );
  }

  const idxDefineEmits = findFirstIndex(lines, l => l.includes('defineEmits<') || l.includes('defineEmits('));
  if (idxDefineEmits >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxDefineEmits,
      'defineEmits：定义组件输出事件。用泛型可以把事件名与参数类型约束住，避免 emit 写错或参数不一致。'
    );
  }

  const idxVFor = findFirstIndex(lines, l => l.includes('v-for='));
  if (idxVFor >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxVFor,
      'v-for：列表渲染。必须配合稳定的 :key（优先使用唯一 id，而不是 index），否则可能导致 DOM 复用错乱。'
    );
  }

  const idxVModel = findFirstIndex(lines, l => l.includes('v-model'));
  if (idxVModel >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxVModel,
      'v-model：双向绑定语法糖。对原生表单控件等价于 :value/:checked + @input/@change；修饰符 .trim/.number/.lazy 用于格式化与触发时机。'
    );
  }

  const idxBind = findFirstIndex(lines, l => l.includes(' v-bind') || l.includes(' :') || l.includes(':class=') || l.includes(':style='));
  if (idxBind >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxBind,
      '动态绑定：:xxx 是 v-bind 的简写，绑定表达式到属性；:class/:style 常用对象/数组/三元表达式实现条件样式。'
    );
  }

  const idxOn = findFirstIndex(lines, l => l.includes(' v-on') || l.includes(' @') || l.includes('@click'));
  if (idxOn >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxOn,
      '事件绑定：@event 是 v-on 的简写；.stop/.prevent 等修饰符会映射到 stopPropagation()/preventDefault()。'
    );
  }

  const idxRef = findFirstIndex(lines, l => /\bref\(/.test(l));
  if (idxRef >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxRef,
      'ref：创建响应式引用。script 中读写需要 .value；模板中会自动解包（一般不写 .value）。'
    );
  }

  const idxComputed = findFirstIndex(lines, l => /\bcomputed\(/.test(l));
  if (idxComputed >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxComputed,
      'computed：派生状态（有缓存）。不要在 computed 里做副作用；副作用放 watch/onMounted 等更合适。'
    );
  }

  const idxWatch = findFirstIndex(lines, l => /\bwatch(Effect)?\(/.test(l));
  if (idxWatch >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxWatch,
      'watch/watchEffect：监听响应式来源并执行副作用。watch 可以拿到新旧值并精确控制依赖；watchEffect 自动收集依赖但更“隐式”。'
    );
  }

  const idxOnMounted = findFirstIndex(lines, l => /\bonMounted\(/.test(l));
  if (idxOnMounted >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxOnMounted,
      'onMounted：组件挂载后执行副作用（如绑定事件、请求数据）。需要配合 onUnmounted 清理监听器/定时器，避免泄漏。'
    );
  }

  const idxStyle = findFirstIndex(lines, l => l.trim().startsWith('<style'));
  if (idxStyle >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxStyle,
      '<style>：SFC 样式块。scoped 会通过选择器注入实现“仅对当前组件生效”的隔离；全局样式一般放在 src/styles。'
    );
  }

  if (notes.length === 0) {
    const first = findFirstIndex(lines, l => l.trim().length > 0);
    if (first >= 0) addAnchoredNote(notes, lines, first, `文件 ${toPosixPath(sourceRel)}：建议优先关注模板指令写法、响应式 API 与事件/状态的关联。`);
  }
};

const generateNotesForTs = (sourceRel: string, lines: string[], notes: PresetNote[]) => {
  const idxImport = findFirstIndex(lines, l => l.trim().startsWith('import '));
  if (idxImport >= 0) {
    const line = lines[idxImport] ?? '';
    const isPinia = line.includes("from 'pinia'") || line.includes('from "pinia"');
    addAnchoredNote(
      notes,
      lines,
      idxImport,
      isPinia
        ? 'Pinia 导入：defineStore 来自 pinia。它用于创建 store（全局/模块化状态容器），在组件中通过 useXxxStore() 使用。'
        : 'ESM import：import ... from ... 是模块导入语法。导入的名字要与导出方式匹配（default export vs named export）。'
    );
  }

  const idxExport = findFirstIndex(lines, l => l.trim().startsWith('export '));
  if (idxExport >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxExport,
      'export：对外暴露变量/函数/类型。export const / export function 是最常见的模块边界写法。'
    );
  }

  const idxDefineStore = findFirstIndex(lines, l => l.includes('defineStore('));
  if (idxDefineStore >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxDefineStore,
      'defineStore(id, setup/options)：Pinia 创建 store 的核心 API。id 是唯一标识；setup 风格 store 用 ref/computed/actions 组织状态与行为。'
    );
  }

  const idxStoreToRefs = findFirstIndex(lines, l => l.includes('storeToRefs('));
  if (idxStoreToRefs >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxStoreToRefs,
      'storeToRefs(store)：把 store 里的响应式属性转换成 ref，避免直接解构导致丢失响应式。一般用于组件模板消费 store 状态。'
    );
  }

  const idxPersist = findFirstIndex(lines, l => l.includes('persist') && (l.includes(':') || l.includes('=')));
  if (idxPersist >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxPersist,
      '持久化配置：persist 常用于 pinia-plugin-persistedstate。它会把指定 state 写入 storage；注意边界（不要持久化敏感信息与临时态）。'
    );
  }

  const idxFetch = findFirstIndex(lines, l => /\bfetch\(/.test(l));
  if (idxFetch >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxFetch,
      'fetch(url, options)：浏览器内置网络请求 API。它返回 Promise<Response>；常见流程是 await fetch → 检查 res.ok → res.json()/res.text()。'
    );
  }

  const idxDispatch = findFirstIndex(lines, l => l.includes('dispatchEvent(new CustomEvent('));
  if (idxDispatch >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxDispatch,
      'CustomEvent：用于跨组件/跨模块通讯（事件总线）。detail 携带数据；监听端通过 window.addEventListener(eventName, ...) 接收。'
    );
  }

  const idxRecord = findFirstIndex(lines, l => l.includes('Record<'));
  if (idxRecord >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxRecord,
      'Record<K, V>：把一组 key 映射到同一种 value 类型，常用于配置表/字典结构。它能让索引访问更安全。'
    );
  }

  const idxType = findFirstIndex(lines, l => l.trim().startsWith('type ') || l.trim().startsWith('export type '));
  if (idxType >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxType,
      'type：类型别名，用来描述结构/联合/映射等类型表达式。它只存在于编译期，不会影响运行时。'
    );
  }

  const idxInterface = findFirstIndex(lines, l => l.trim().startsWith('interface ') || l.trim().startsWith('export interface '));
  if (idxInterface >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxInterface,
      'interface：描述对象结构（shape）。适合做 extends 扩展与声明合并；与 type 的选择更多是工程约定。'
    );
  }

  const idxGeneric = findFirstIndex(lines, l => /<\s*[A-Z][A-Za-z0-9_]*\s*(extends\s+[^>]+)?>/.test(l) && (l.includes('function') || l.includes('type') || l.includes('interface') || l.includes('class')));
  if (idxGeneric >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxGeneric,
      '泛型：用 <T> 抽象可复用的类型参数；T extends ... 用于约束入参范围，避免“任意类型”导致的类型逃逸。'
    );
  }

  const idxAsync = findFirstIndex(lines, l => /\basync\b/.test(l) && /\bfunction\b/.test(l));
  if (idxAsync >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxAsync,
      'async/await：async 函数返回 Promise；await 会等待 Promise 结果。错误处理要用 try/catch 或在调用处 catch，避免未捕获拒绝。'
    );
  }

  const idxAsConst = findFirstIndex(lines, l => l.includes('as const'));
  if (idxAsConst >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxAsConst,
      'as const：把值锁成字面量类型，并推导为只读元组/只读属性。常用于配置表与状态枚举推导。'
    );
  }

  const idxOptional = findFirstIndex(lines, l => /\w+\?:\s*[^;]+/.test(l));
  if (idxOptional >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxOptional,
      '?: 可选属性/参数：表示字段可能不存在（undefined）。读取时要配合判空/可选链（?.）处理。'
    );
  }

  if (notes.length === 0) {
    const first = findFirstIndex(lines, l => l.trim().length > 0);
    if (first >= 0) addAnchoredNote(notes, lines, first, `文件 ${toPosixPath(sourceRel)}：建议优先关注 import/export、类型边界与关键函数签名。`);
  }
};

const generateNotesForCss = (sourceRel: string, lines: string[], notes: PresetNote[]) => {
  const idxSelector = findFirstIndex(lines, l => /(^|\s)[.#a-zA-Z_-]+[^{]*\{/.test(l) && !l.trim().startsWith('@'));
  if (idxSelector >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxSelector,
      '选择器语法：selector { ... } 定义一组规则。选择器可以组合（后代/并列/伪类/属性选择器），最终由层叠与优先级决定生效结果。'
    );
  }

  const idxRootVar = findFirstIndex(lines, l => l.includes(':root') || l.includes('--'));
  if (idxRootVar >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxRootVar,
      'CSS 变量：以 -- 开头，常在 :root 定义全局主题变量，用 var(--x) 引用。适合主题切换与统一间距/颜色体系。'
    );
  }

  const idxMedia = findFirstIndex(lines, l => l.trim().startsWith('@media'));
  if (idxMedia >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxMedia,
      '@media：媒体查询。建议 mobile-first：先写基础样式，再用 (min-width: ...) 覆盖增强。'
    );
  }

  const idxKeyframes = findFirstIndex(lines, l => l.trim().startsWith('@keyframes'));
  if (idxKeyframes >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxKeyframes,
      '@keyframes：定义动画关键帧。配合 animation-name/duration/timing-function 等属性使用。'
    );
  }

  if (notes.length === 0) {
    const first = findFirstIndex(lines, l => l.trim().length > 0);
    if (first >= 0) addAnchoredNote(notes, lines, first, `文件 ${toPosixPath(sourceRel)}：建议优先关注选择器、层叠、布局相关属性与响应式写法。`);
  }
};

const generateNotesForJson = (sourceRel: string, lines: string[], notes: PresetNote[]) => {
  const idxFirstProp = findFirstIndex(lines, l => l.trim().startsWith('"') && l.includes(':'));
  const idxFirstNonEmpty = findFirstIndex(lines, l => l.trim().length > 0);
  const idx = idxFirstProp >= 0 ? idxFirstProp : idxFirstNonEmpty;
  if (idx >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idx,
      'JSON 语法：键必须用双引号；不允许注释与尾随逗号。对象用 {}，数组用 []，字符串必须用双引号。'
    );
  }

  const idxArray = findFirstIndex(lines, l => l.includes('[') && l.includes(']') === false);
  if (idxArray >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxArray,
      '数组语法：用 [] 表示有序集合；元素用逗号分隔。常见数据结构是“对象数组”，用于列表渲染与配置表。'
    );
  }

  if (notes.length === 0 && idxFirstNonEmpty >= 0) {
    addAnchoredNote(notes, lines, idxFirstNonEmpty, `文件 ${toPosixPath(sourceRel)}：JSON 是纯数据格式，不支持表达式；复杂逻辑应放到 TS/JS。`);
  }
};

const generateNotesForMd = (sourceRel: string, lines: string[], notes: PresetNote[]) => {
  const idxHeading = findFirstIndex(lines, l => /^#{1,6}\s+/.test(l));
  if (idxHeading >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxHeading,
      '标题语法：# 到 ###### 表示 1~6 级标题。标题层级应递进，便于生成目录与阅读。'
    );
  }

  const idxCodeFence = findFirstIndex(lines, l => l.trim().startsWith('```'));
  if (idxCodeFence >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxCodeFence,
      '代码块语法：```lang 开始，``` 结束。建议标注语言（如 js/ts/css/bash），便于高亮与复制。'
    );
  }

  const idxLink = findFirstIndex(lines, l => /\[[^\]]+\]\([^)]+\)/.test(l));
  if (idxLink >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxLink,
      '链接语法：[text](url)。用于引用外部资料或站内跳转；图片语法是 ![alt](url)。'
    );
  }

  if (notes.length === 0) {
    const first = findFirstIndex(lines, l => l.trim().length > 0);
    if (first >= 0) addAnchoredNote(notes, lines, first, `文件 ${toPosixPath(sourceRel)}：建议关注标题、列表、链接与代码块的基础语法。`);
  }
};

const generateNotesForEnv = (sourceRel: string, lines: string[], notes: PresetNote[]) => {
  const idxVite = findFirstIndex(lines, l => l.trim().startsWith('VITE_'));
  if (idxVite >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxVite,
      'KEY=VALUE：环境变量文件的基本语法。Vite 只会把以 VITE_ 开头的变量注入到前端构建中，其它变量不会暴露到浏览器。'
    );
  }

  const idxEmpty = findFirstIndex(lines, l => /=$/.test(l.trim()));
  if (idxEmpty >= 0) {
    addAnchoredNote(
      notes,
      lines,
      idxEmpty,
      '空值写法：KEY= 表示值为空字符串。读取时要考虑“未配置”与“配置为空”的差异，必要时提供默认值或禁用相关功能。'
    );
  }

  if (notes.length === 0) {
    const first = findFirstIndex(lines, l => l.trim().length > 0);
    if (first >= 0) addAnchoredNote(notes, lines, first, `文件 ${toPosixPath(sourceRel)}：环境变量遵循 KEY=VALUE，前端变量需 VITE_ 前缀。`);
  }
};

const generateNotes = (sourceRel: string, ext: string, lines: string[], existingNotes: PresetNote[]) => {
  const notes: PresetNote[] = [...existingNotes];
  if (ext === '.vue') generateNotesForVue(sourceRel, lines, notes);
  else if (ext === '.ts' || ext === '.d.ts') generateNotesForTs(sourceRel, lines, notes);
  else if (ext === '.css') generateNotesForCss(sourceRel, lines, notes);
  else if (ext === '.json') generateNotesForJson(sourceRel, lines, notes);
  else if (ext === '.md') generateNotesForMd(sourceRel, lines, notes);
  else if (ext === '.env' || ext === '.env.example') generateNotesForEnv(sourceRel, lines, notes);
  else {
    const first = findFirstIndex(lines, l => l.trim().length > 0);
    if (first >= 0) addAnchoredNote(notes, lines, first, `文件 ${toPosixPath(sourceRel)}：建议关注本文件的关键声明与调用点，补齐对应语法边界。`);
  }

  return notes;
};

const main = () => {
  if (!fs.existsSync(presetDir)) {
    console.error(`Preset dir not found: ${presetDir}`);
    process.exit(1);
  }

  const presetFiles = walkFiles(presetDir).filter(p => p.endsWith('.notes.json'));
  let updated = 0;
  let createdNotes = 0;

  for (const presetPath of presetFiles) {
    const rel = toPosixPath(path.relative(presetDir, presetPath));
    const sourceRel = rel.replace(/\.notes\.json$/i, '');
    const sourceAbs = path.join(rootDir, sourceRel);
    if (!fs.existsSync(sourceAbs)) continue;

    const sourceText = fs.readFileSync(sourceAbs, 'utf8');
    const sourceLines = splitLines(sourceText);

    const raw = fs.readFileSync(presetPath, 'utf8');
    let preset: PerFilePreset;
    try {
      preset = JSON.parse(raw) as PerFilePreset;
    } catch {
      continue;
    }

    const ext = extOf(sourceRel);
    const prevCount = Array.isArray(preset.notes) ? preset.notes.length : 0;
    const existingNotes = Array.isArray(preset.notes) ? preset.notes : [];

    const nextNotes = generateNotes(sourceRel, ext, sourceLines, existingNotes);
    const nextIntro = buildIntro(sourceRel, ext);

    const next: PerFilePreset = {
      intro: nextIntro,
      notes: nextNotes
    };

    const nextRaw = JSON.stringify(next, null, 2) + '\n';
    if (raw !== nextRaw) {
      fs.writeFileSync(presetPath, nextRaw, 'utf8');
      updated++;
      createdNotes += Math.max(0, nextNotes.length - prevCount);
    }
  }

  console.log(`Updated preset files: ${updated}/${presetFiles.length}`);
  console.log(`Added notes (approx): ${createdNotes}`);
};

main();
