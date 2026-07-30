
export enum NodeType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export interface FileNode {
  name: string;
  path: string; // e.g. "notes/tech/vue.md"
  fetchPath?: string; // e.g. "raw/App_vue.txt"
  renderPath?: string;
  renderedHtml?: string;
  renderVersion?: number;
  type: NodeType;
  children?: FileNode[];
  content?: string;
  /**
   * Lightweight snippet (first ~1200 chars) used for search indexing without
   * fetching the full markdown upfront. Populated by the file tree generator.
   */
  contentSnippet?: string;
  excerpt?: string;
  toc?: TocItem[];
  /** Precomputed stats to avoid recalculating on the client side. */
  wordCount?: number;
  lineCount?: number;
  lastModified?: string;
  isSource?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
