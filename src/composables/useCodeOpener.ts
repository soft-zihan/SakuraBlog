import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useCodeModal } from './useCodeModal';
import { findNodeByPath, fetchFileContent } from '../utils/fileUtils';
import { NodeType } from '../types';

export function useCodeOpener() {
  const appStore = useAppStore();
  const codeModal = useCodeModal();

  const parseRangeToken = (raw?: string) => {
    if (!raw) return { startLine: undefined, endLine: undefined };
    const match = raw.match(/L?(\d+)(?:-L?(\d+))?/i);
    if (!match) return { startLine: undefined, endLine: undefined };
    const startLine = Number(match[1]);
    const endLine = match[2] ? Number(match[2]) : undefined;
    return {
      startLine: Number.isFinite(startLine) ? startLine : undefined,
      endLine: Number.isFinite(endLine || 0) ? endLine : undefined
    };
  };

  const buildLineSnippet = (content: string, startLine?: number, endLine?: number) => {
    if (!startLine) return content;
    const lines = content.split(/\r?\n/);
    const safeStart = Math.max(1, startLine);
    const safeEnd = Math.min(lines.length, endLine && endLine >= safeStart ? endLine : safeStart);
    const width = String(safeEnd).length;
    const slice = lines.slice(safeStart - 1, safeEnd);
    return slice.map((line: string, idx: number) => `${String(safeStart + idx).padStart(width, ' ')} | ${line}`).join('\n');
  };

  const openCodeByPath = async (path: string, range?: { startLine?: number; endLine?: number }) => {
    const fileName = path.split('/').pop() || path;
    const rangeLabel = range?.startLine
      ? ` (L${range.startLine}${range.endLine && range.endLine !== range.startLine ? `-L${range.endLine}` : ''})`
      : '';

    await codeModal.openCodeModal(`${fileName}${rangeLabel}`, 'Loading...', path);

    let node = findNodeByPath(appStore.fileSystem, path);
    let content = '';

    if (node && node.type === NodeType.FILE) {
      if (!node.content) {
        node.content = await fetchFileContent(node);
      }
      content = node.content;
    } else {
      content = await codeModal.fetchSourceCodeFile(path);
    }

    const finalContent = range?.startLine ? buildLineSnippet(content, range.startLine, range.endLine) : content;
    codeModal.setCodeModalContent(finalContent);
  };

  const handleOpenCodeEvent = async (e: Event) => {
    const detail = (e as CustomEvent).detail as {
      path?: string;
      startLine?: number;
      endLine?: number;
      range?: string;
    };
    if (!detail?.path) return;

    let startLine = detail.startLine;
    let endLine = detail.endLine;

    if (!startLine && detail.range) {
      const parsed = parseRangeToken(detail.range);
      startLine = parsed.startLine;
      endLine = parsed.endLine;
    }

    await openCodeByPath(detail.path, { startLine, endLine });
  };

  const initCodeOpener = () => {
    onMounted(() => {
      window.addEventListener('sakura-open-code', handleOpenCodeEvent as EventListener);
    });

    onUnmounted(() => {
      window.removeEventListener('sakura-open-code', handleOpenCodeEvent as EventListener);
    });
  };

  return {
    openCodeByPath,
    initCodeOpener
  };
}
