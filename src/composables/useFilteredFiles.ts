import { computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useArticleStore } from '../stores/articleStore';
import { useFileVisibility } from './useContentClick';
import { NodeType } from '../types';
import type { FileNode } from '../types';

export function useFilteredFiles() {
  const appStore = useAppStore();
  const articleStore = useArticleStore();
  
  const { isFileVisible, collectAllTags } = useFileVisibility(articleStore);

  const currentLangRoot = computed(() => {
    const root = appStore.fileSystem.find((node: FileNode) => node.type === NodeType.DIRECTORY && node.name === appStore.lang);
    if (root?.children?.length) return root.children;
    return appStore.fileSystem.filter((node: FileNode) => !(node.type === NodeType.DIRECTORY && node.path === 'source'));
  });

  const filteredFileSystem = computed(() => {
    const filterTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.type === NodeType.FILE) {
          return isFileVisible(node) ? node : null;
        }
        const children = node.children ? filterTree(node.children) : [];
        return { ...node, children } as FileNode;
      }).filter(Boolean) as FileNode[];
    };

    return filterTree(currentLangRoot.value || []);
  });

  const filteredFlatFiles = computed(() => {
    const flatten = (nodes: FileNode[]): FileNode[] => {
      let files: FileNode[] = [];
      for (const node of nodes) {
        if (node.type === NodeType.FILE) files.push(node);
        else if (node.children) files = files.concat(flatten(node.children));
      }
      return files;
    };

    let files = flatten(currentLangRoot.value || []);
    files = files.filter(isFileVisible);

    return files.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
  });

  const labFolder = computed(() => {
    const preferredName = appStore.lang === 'zh' ? 'VUE学习笔记' : 'VUE Learning';
    const fallbackName = appStore.lang === 'zh' ? 'VUE Learning' : 'VUE学习笔记';
    const findFolderByName = (nodes: FileNode[], name: string): FileNode | null => {
      for (const node of nodes) {
        if (node.type === NodeType.DIRECTORY && node.name.toLowerCase() === name.toLowerCase()) {
          return node;
        }
        if (node.children) {
          const found = findFolderByName(node.children, name);
          if (found) return found;
        }
      }
      return null;
    };
    return findFolderByName(appStore.fileSystem, preferredName) || findFolderByName(appStore.fileSystem, fallbackName);
  });
  
  return {
    currentLangRoot,
    filteredFileSystem,
    filteredFlatFiles,
    labFolder,
    collectAllTags
  };
}
