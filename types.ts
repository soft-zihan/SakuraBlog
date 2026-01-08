
export enum NodeType {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export interface FileNode {
  name: string;
  path: string; // e.g. "notes/tech/vue.md"
  fetchPath?: string; // e.g. "raw/App_vue.txt"
  type: NodeType;
  children?: FileNode[];
  content?: string;
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
