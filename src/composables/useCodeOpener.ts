import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useCodeModal } from './useCodeModal';
import { findNodeByPath, fetchFileContent } from '../utils/fileUtils';
import { NodeType } from '../types';

export function useCodeOpener() {
  const appStore = useAppStore();
  const codeModal = useCodeModal();

  const findBlockEnd = (lines: string[], startIdx: number, closeTag: string) => {
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase().startsWith(closeTag.toLowerCase())) {
        return { startLine: startIdx + 1, endLine: i + 1 }
      }
    }
    return { startLine: startIdx + 1, endLine: Math.min(startIdx + 50, lines.length) }
  }

  const findCodeBlockEnd = (lines: string[], startIdx: number) => {
    let braceCount = 0
    let foundFirstBrace = false
    let endIdx = startIdx

    for (let i = startIdx; i < lines.length && i < startIdx + 240; i++) {
      const line = lines[i]
      for (const ch of line) {
        if (ch === '{') {
          braceCount++
          foundFirstBrace = true
        } else if (ch === '}') {
          braceCount--
        }
      }

      endIdx = i
      if (foundFirstBrace && braceCount <= 0 && i > startIdx) break
    }

    return { startLine: startIdx + 1, endLine: Math.min(endIdx + 1, lines.length) }
  }

  const findAnchorInCode = (content: string, anchor: string) => {
    const lines = content.split(/\r?\n/)
    const a = anchor.trim()
    const lower = a.toLowerCase()

    if (['template', 'script', 'style'].includes(lower)) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.toLowerCase().startsWith(`<${lower}`)) {
          return findBlockEnd(lines, i, `</${lower}>`)
        }
      }
    }
    if (lower === 'setup') {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (/^<script[^>]*\bsetup\b/i.test(line)) {
          return findBlockEnd(lines, i, '</script>')
        }
      }
    }

    const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const patterns = [
      new RegExp(`^export\\s+(default\\s+)?(async\\s+)?function\\s+${escaped}\\b`, 'i'),
      new RegExp(`^(async\\s+)?function\\s+${escaped}\\b`, 'i'),
      new RegExp(`^(export\\s+)?(const|let|var)\\s+${escaped}\\s*=`, 'i'),
      new RegExp(`^(export\\s+)?(abstract\\s+)?class\\s+${escaped}\\b`, 'i'),
      new RegExp(`^(export\\s+)?(interface|type)\\s+${escaped}\\b`, 'i')
    ]

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim()
      if (patterns.some(p => p.test(trimmed))) {
        return findCodeBlockEnd(lines, i)
      }
    }

    return null
  }

  const findFirstMatchInCode = (content: string, query: string) => {
    const q = query.trim()
    if (!q) return null
    const lines = content.split(/\r?\n/)
    const needle = q.toLowerCase()
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(needle)) {
        return { startLine: i + 1, endLine: i + 1 }
      }
    }
    return null
  }

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

  const openCodeByPath = async (
    path: string,
    range?: { startLine?: number; endLine?: number; anchor?: string; find?: string },
    options?: { syncUrl?: boolean }
  ) => {
    const fileName = path.split('/').pop() || path;
    const rangeLabel = range?.startLine
      ? ` (L${range.startLine}${range.endLine && range.endLine !== range.startLine ? `-L${range.endLine}` : ''})`
      : (range?.anchor ? ` → ${range.anchor}` : '');

    await codeModal.openCodeModal(
      `${fileName}${rangeLabel}`,
      'Loading...',
      path,
      range?.startLine ? { ...options, highlight: { startLine: range.startLine, endLine: range.endLine } } : options
    );

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

    let startLine = range?.startLine
    let endLine = range?.endLine
    if (!startLine && range?.anchor) {
      const anchorRange = findAnchorInCode(content, range.anchor)
      if (anchorRange) {
        startLine = anchorRange.startLine
        endLine = anchorRange.endLine
      }
    }
    if (!startLine && range?.find) {
      const matchRange = findFirstMatchInCode(content, range.find)
      if (matchRange) {
        startLine = matchRange.startLine
        endLine = matchRange.endLine
      }
    }

    codeModal.setCodeModalContent(content);
    codeModal.setHighlightRange(startLine, endLine);
  };

  const handleOpenCodeEvent = async (e: Event) => {
    const detail = (e as CustomEvent).detail as {
      path?: string;
      startLine?: number;
      endLine?: number;
      range?: string;
      anchor?: string;
      find?: string;
    };
    if (!detail?.path) return;

    let startLine = detail.startLine;
    let endLine = detail.endLine;

    if (!startLine && detail.range) {
      const parsed = parseRangeToken(detail.range);
      startLine = parsed.startLine;
      endLine = parsed.endLine;
    }

    await openCodeByPath(detail.path, { startLine, endLine, anchor: detail.anchor, find: detail.find });
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
