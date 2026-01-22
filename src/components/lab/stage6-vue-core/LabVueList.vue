
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-teal-100 dark:border-gray-700 shadow-sm backdrop-blur-md h-full flex flex-col relative">
    <!-- View Source Toggle -->
    <button 
      @click="showCode = !showCode" 
      class="absolute top-6 right-6 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-gray-900 px-3 py-1 rounded-full transition-colors border border-teal-100 dark:border-gray-600 z-10"
    >
      {{ showCode ? t.lab_vue_view_ui : t.lab_vue_view_code }}
    </button>

    <p class="text-xs text-gray-500 dark:text-gray-400 mb-6 pr-20">{{ t.lab_vue_list_desc }}</p>

    <!-- Source Code View -->
    <div v-if="showCode" class="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-[#1e1e1e] shadow-inner animate-fade-in">
        <div class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
            <span class="text-xs text-gray-400 font-mono">LabVueList.vue (Core Logic)</span>
        </div>
        <!-- Added v-pre to skip compilation of mustache syntax inside -->
        <pre v-pre class="p-4 text-xs font-mono text-gray-300 overflow-auto custom-scrollbar h-full leading-relaxed"><code class="language-html">&lt;!-- 1. 列表渲染 (v-for) --&gt;
&lt;tr v-for="(item, index) in items" :key="item.id"&gt;
  &lt;!-- 索引展示 --&gt;
  &lt;td&gt;{{ index + 1 }}&lt;/td&gt;
  &lt;td&gt;{{ item.name }}&lt;/td&gt;
  
  &lt;!-- 2. 条件渲染 (v-if/v-else-if/v-else) --&gt;
  &lt;td&gt;
    &lt;span v-if="item.gender === 1"&gt;男&lt;/span&gt;
    &lt;span v-else-if="item.gender === 2"&gt;女&lt;/span&gt;
    &lt;span v-else&gt;其他&lt;/span&gt;
  &lt;/td&gt;

  &lt;!-- 3. 显示切换 (v-show) --&gt;
  &lt;td&gt;
    &lt;span v-show="item.job === 1"&gt;讲师&lt;/span&gt;
    &lt;span v-show="item.job === 2"&gt;班主任&lt;/span&gt;
    &lt;span v-show="item.job === 3"&gt;其他&lt;/span&gt;
  &lt;/td&gt;
&lt;/tr&gt;

&lt;!-- 4. 双向绑定 (v-model) --&gt;
&lt;input v-model="newItem.name" type="text" placeholder="姓名" /&gt;
&lt;select v-model="newItem.job"&gt;
    &lt;option :value="1"&gt;讲师&lt;/option&gt;
    &lt;option :value="2"&gt;班主任&lt;/option&gt;
&lt;/select&gt;</code></pre>
    </div>

    <!-- UI View -->
    <div v-else class="flex flex-col lg:flex-row gap-6 animate-fade-in">
        
        <!-- List Area (v-for) - Takes more space -->
        <div class="flex-[2] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-0 overflow-hidden flex flex-col min-h-[350px] shadow-lg">
             <div class="bg-teal-50 dark:bg-teal-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                 <h4 class="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <span class="text-2xl">👥</span>
                    <span class="text-teal-600 dark:text-teal-400">Employee List</span>
                </h4>
                <span class="text-xs bg-white dark:bg-gray-700 border border-teal-200 dark:border-gray-600 px-2 py-0.5 rounded text-teal-600 dark:text-teal-300 font-bold">{{ items.length }} Records</span>
             </div>
             
             <div class="flex-1 p-0 overflow-y-auto max-h-[350px] custom-scrollbar">
                 <table class="w-full text-sm text-left">
                    <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th class="px-4 py-3 text-center">ID</th>
                            <th class="px-4 py-3">{{ t.lab_vue_form_name }}</th>
                            <th class="px-4 py-3">{{ t.lab_vue_form_gender }} (v-if)</th>
                            <th class="px-4 py-3">{{ t.lab_vue_form_job }} (v-show)</th>
                            <th class="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="items.length === 0">
                            <td colspan="5" class="px-4 py-8 text-center text-gray-400 italic">{{ t.lab_vue_empty }}</td>
                        </tr>
                        <!-- v-for loop -->
                        <tr 
                            v-for="(item, index) in items" 
                            :key="item.id"
                            class="border-b border-gray-100 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors group"
                        >
                            <td class="px-4 py-3 font-mono text-gray-400 text-center">{{ index + 1 }}</td>
                            <td class="px-4 py-3 font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-gray-200 text-[10px] flex items-center justify-center text-gray-500">
                                    {{ item.name.charAt(0) }}
                                </div>
                                {{ item.name }}
                            </td>
                            <td class="px-4 py-3">
                                <!-- Logic: Gender 1=Male, 2=Female -->
                                <span v-if="item.gender === 1" class="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                    {{ t.lab_gender_1 }}
                                </span>
                                <span v-else-if="item.gender === 2" class="bg-pink-100 text-pink-800 text-[10px] px-2 py-0.5 rounded border border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800">
                                    {{ t.lab_gender_2 }}
                                </span>
                                <span v-else class="text-gray-400 text-xs">Unknown</span>
                            </td>
                            <td class="px-4 py-3">
                                <!-- Logic: Job 1=Lecturer, 2=Teacher, 3=Other -->
                                <div class="flex items-center gap-1">
                                    <span v-show="item.job === 1" class="text-purple-600 dark:text-purple-400 font-medium text-xs">🧑‍🏫 {{ t.lab_job_1 }}</span>
                                    <span v-show="item.job === 2" class="text-orange-600 dark:text-orange-400 font-medium text-xs">🧢 {{ t.lab_job_2 }}</span>
                                    <span v-show="item.job === 3" class="text-gray-500 dark:text-gray-400 text-xs">🔧 {{ t.lab_job_3 }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button @click="removeItem(index)" class="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                 </table>
             </div>
        </div>

        <!-- Form Area (v-model) - Compact sidebar -->
        <div class="w-full lg:w-72 xl:w-80 bg-gray-50 dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-fit">
            <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <span class="text-lg">📝</span>
                <span>{{ t.lab_vue_add }}</span>
            </h4>
            
            <div class="space-y-5">
                <div>
                    <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">{{ t.lab_vue_form_name }} <span class="text-red-400">*</span></label>
                    <input v-model="newItem.name" type="text" class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="e.g. Xie Xun">
                </div>

                <div>
                    <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">{{ t.lab_vue_form_gender }}</label>
                    <div class="grid grid-cols-2 gap-2">
                        <button 
                            @click="newItem.gender = 1"
                            class="px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1"
                            :class="newItem.gender === 1 ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:border-blue-400'"
                        >
                            <span>♂</span> {{ t.lab_gender_1 }} (1)
                        </button>
                        <button 
                            @click="newItem.gender = 2"
                            class="px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1"
                            :class="newItem.gender === 2 ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:border-pink-400'"
                        >
                            <span>♀</span> {{ t.lab_gender_2 }} (2)
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">{{ t.lab_vue_form_job }}</label>
                    <select v-model="newItem.job" class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                        <option :value="1">{{ t.lab_job_1 }} (1)</option>
                        <option :value="2">{{ t.lab_job_2 }} (2)</option>
                        <option :value="3">{{ t.lab_job_3 }} (3)</option>
                    </select>
                </div>

                <div class="pt-2">
                    <button @click="addItem" class="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-teal-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2" :disabled="!newItem.name">
                        <span>➕</span> {{ t.lab_vue_add }}
                    </button>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { I18N } from '../../../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);
const showCode = ref(false);

interface Employee {
    id: number;
    name: string;
    gender: 1 | 2; // 1: Male, 2: Female
    job: 1 | 2 | 3; // 1: Lecturer, 2: Teacher, 3: Other
}

const newItem = reactive({
    name: '',
    gender: 1,
    job: 1
});

// Initial data
const items = ref<Employee[]>([
    { id: 1, name: '谢逊 (Xie Xun)', gender: 1, job: 1 },
    { id: 2, name: '韦一笑 (Wei Yixiao)', gender: 1, job: 1 },
    { id: 3, name: '黛绮丝 (Dai Qisi)', gender: 2, job: 2 },
    { id: 4, name: '殷天正 (Yin Tianzheng)', gender: 1, job: 3 }
]);

const addItem = () => {
    if (!newItem.name) return;
    items.value.push({
        id: Date.now(),
        name: newItem.name,
        gender: newItem.gender as 1 | 2,
        job: newItem.job as 1 | 2 | 3
    });
    newItem.name = ''; // Reset name, keep options
};

const removeItem = (index: number) => {
    items.value.splice(index, 1);
};
</script>
