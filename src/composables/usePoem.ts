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

type ManifestChunk = { file: string; count: number };
type Manifest = {
  version: number;
  total: number;
  chunks: ManifestChunk[];
};

export function usePoem(lang: any) {
  const welcomePoem = ref<GuwenItem | null>(null);
  const welcomePoemLoading = ref(true);
  const welcomePoemError = ref('');

  // 缓存 manifest，避免重复请求
  let cachedManifest: Manifest | null = null;

  const fetchManifest = async (): Promise<Manifest> => {
    if (cachedManifest) return cachedManifest;
    const res = await fetch('./data/gushiwen.manifest.json');
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`);
    cachedManifest = await res.json() as Manifest;
    return cachedManifest!;
  };

  const parseGuwenItems = (raw: string): GuwenItem[] => {
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
    return [];
  };

  const loadRandomPoem = async () => {
    welcomePoemLoading.value = true;
    welcomePoemError.value = '';
    try {
      // 1. 获取 manifest（很小，~1KB）
      const manifest = await fetchManifest();
      if (!manifest.chunks.length) throw new Error('No chunks available');

      // 2. 随机选一个 chunk（每个 ~66KB-861KB，远小于原始 8.79MB）
      const chunk = manifest.chunks[Math.floor(Math.random() * manifest.chunks.length)];
      const res = await fetch(`./data/${chunk.file}`);
      if (!res.ok) throw new Error(`Chunk fetch failed: ${res.status}`);
      const raw = await res.text();
      const items = parseGuwenItems(raw);
      if (!items.length) throw new Error('Empty chunk data');

      // 3. 从 chunk 中随机取一首诗
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
