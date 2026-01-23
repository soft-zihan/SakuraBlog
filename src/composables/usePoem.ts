import { ref, computed } from 'vue';

export type GuwenItem = {
  title?: string;
  dynasty?: string;
  writer?: string;
  content?: string;
  remark?: string;
  translation?: string;
  shangxi?: string;
  type?: string;
};

export function usePoem(lang: any) {
  const welcomePoem = ref<GuwenItem | null>(null);
  const welcomePoemLoading = ref(false);
  const welcomePoemError = ref('');
  
  // Note: import.meta.glob context might be different if moved? 
  // It should be fine as long as the relative path is correct from the new file location.
  // The original was in src/App.vue, new is src/composables/usePoem.ts.
  // The path was './gushiwen/guwen/*.json'. 
  // In App.vue (src/), it points to src/gushiwen...
  // In usePoem.ts (src/composables/), we need '../../data/gushiwen/guwen/*.json'.
  const guwenUrls = Object.values(import.meta.glob('../../data/gushiwen/guwen/*.json', { as: 'url', eager: true })) as string[];

  const parseGuwenItems = (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return (parsed as GuwenItem[]).filter(item => item?.content);
      }
      const data = (parsed as { data?: GuwenItem[] } | null)?.data;
      if (Array.isArray(data)) {
        return data.filter(item => item?.content);
      }
    } catch {
    }
    const items: GuwenItem[] = [];
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const item = JSON.parse(trimmed) as GuwenItem;
        if (item?.content) items.push(item);
      } catch {
        continue;
      }
    }
    return items;
  };

  const loadRandomPoem = async () => {
    if (!guwenUrls.length) {
      welcomePoemError.value = lang.value === 'zh' ? '未找到古诗文资源' : 'Poetry source missing';
      return;
    }
    welcomePoemLoading.value = true;
    welcomePoemError.value = '';
    try {
      const url = guwenUrls[Math.floor(Math.random() * guwenUrls.length)];
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const raw = await res.text();
      const items = parseGuwenItems(raw);
      if (!items.length) throw new Error('Empty data');
      welcomePoem.value = items[Math.floor(Math.random() * items.length)];
    } catch (e) {
      welcomePoemError.value = lang.value === 'zh' ? '诗文加载失败' : 'Failed to load poem';
    } finally {
      welcomePoemLoading.value = false;
    }
  };

  const welcomePoemLines = computed(() => {
    const content = welcomePoem.value?.content?.trim();
    if (!content) return [];
    return content.split(/\n+/).map(line => line.trim()).filter(Boolean);
  });

  const welcomePoemAuthorLine = computed(() => {
    const dynasty = welcomePoem.value?.dynasty?.trim();
    const writer = welcomePoem.value?.writer?.trim();
    if (!dynasty && !writer) return '';
    const dynastyText = dynasty ? `【${dynasty}】` : '';
    return `${dynastyText}${writer || ''}`;
  });

  const welcomePoemDetails = computed(() => {
    const items: Array<{ label: string; value: string }> = [];
    const remark = welcomePoem.value?.remark;
    const translation = welcomePoem.value?.translation;
    const shangxi = welcomePoem.value?.shangxi;
    
    // We access lang.value here. Ensure lang is a Ref.
    if (remark) items.push({ label: lang.value === 'zh' ? '注释' : 'Notes', value: remark });
    if (translation) items.push({ label: lang.value === 'zh' ? '译文' : 'Translation', value: translation });
    if (shangxi) items.push({ label: lang.value === 'zh' ? '赏析' : 'Appreciation', value: shangxi });
    return items;
  });

  return {
    welcomePoem,
    welcomePoemLoading,
    welcomePoemError,
    loadRandomPoem,
    welcomePoemLines,
    welcomePoemAuthorLine,
    welcomePoemDetails
  };
}
