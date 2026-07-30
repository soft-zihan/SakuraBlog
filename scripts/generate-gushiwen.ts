import fs from 'fs';
import path from 'path';

type GuwenItem = Record<string, unknown>;

const rootDir = process.cwd();
const sourceFile = path.join(rootDir, 'data', 'gushiwen', 'guwen', 'gushiwen.json');
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(publicDir, 'data');

const MANIFEST_NAME = 'gushiwen.manifest.json';
const CHUNK_PREFIX = 'gushiwen.chunk.';
const CHUNK_SUFFIX = '.json';

const MAX_ITEMS_PER_CHUNK = 120;
const MAX_CHARS_PER_CHUNK = 650_000;

const readAsArray = (raw: string): GuwenItem[] => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as GuwenItem[];
    const data = (parsed as { data?: unknown } | null)?.data;
    if (Array.isArray(data)) return data as GuwenItem[];
  } catch {}

  const lines = raw.split(/\r?\n/);
  const items: GuwenItem[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const item = JSON.parse(trimmed) as unknown;
      if (item && typeof item === 'object') items.push(item as GuwenItem);
    } catch {}
  }
  return items;
};

const cleanOldOutputs = () => {
  if (!fs.existsSync(dataDir)) return;
  const entries = fs.readdirSync(dataDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (entry.name === MANIFEST_NAME) {
      fs.rmSync(path.join(dataDir, entry.name), { force: true });
      continue;
    }
    if (entry.name.startsWith(CHUNK_PREFIX) && entry.name.endsWith(CHUNK_SUFFIX)) {
      fs.rmSync(path.join(dataDir, entry.name), { force: true });
    }
  }
};

const main = () => {
  if (!fs.existsSync(sourceFile)) {
    console.warn(`⚠️ gushiwen source not found: ${sourceFile}`);
    return;
  }

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  console.log('🌸 Sakura Notes: Generating gushiwen chunks...');
  cleanOldOutputs();

  const raw = fs.readFileSync(sourceFile, 'utf-8');
  const items = readAsArray(raw);
  if (!items.length) {
    console.warn('⚠️ gushiwen source parsed as empty array; skip generating.');
    return;
  }

  const chunks: Array<{ file: string; count: number }> = [];
  let chunkIndex = 0;
  let current: GuwenItem[] = [];
  let currentChars = 2;

  const flush = () => {
    if (!current.length) return;
    const file = `${CHUNK_PREFIX}${String(chunkIndex).padStart(3, '0')}${CHUNK_SUFFIX}`;
    const outPath = path.join(dataDir, file);
    fs.writeFileSync(outPath, JSON.stringify(current), 'utf-8');
    chunks.push({ file, count: current.length });
    chunkIndex += 1;
    current = [];
    currentChars = 2;
  };

  for (const item of items) {
    const encoded = JSON.stringify(item);
    const extra = (current.length ? 1 : 0) + encoded.length;
    if (
      current.length &&
      (current.length >= MAX_ITEMS_PER_CHUNK || currentChars + extra > MAX_CHARS_PER_CHUNK)
    ) {
      flush();
    }
    current.push(item);
    currentChars += extra;
  }
  flush();

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: 'data/gushiwen/guwen/gushiwen.json',
    total: items.length,
    chunking: {
      maxItemsPerChunk: MAX_ITEMS_PER_CHUNK,
      maxCharsPerChunk: MAX_CHARS_PER_CHUNK
    },
    chunks
  };

  fs.writeFileSync(path.join(dataDir, MANIFEST_NAME), JSON.stringify(manifest), 'utf-8');
  console.log(`✅ gushiwen generated: ${chunks.length} chunks, total ${items.length} items`);
};

main();
