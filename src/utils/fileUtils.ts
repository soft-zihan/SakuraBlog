import { NodeType } from '../types'
import type { FileNode } from '../types'

export const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node
    if (node.children) {
      const found = findNodeByPath(node.children, path)
      if (found) return found
    }
  }
  const decodedPath = decodeURIComponent(path)
  if (decodedPath !== path) {
    for (const node of nodes) {
      if (node.path === decodedPath) return node
      if (node.children) {
        const found = findNodeByPath(node.children, decodedPath)
        if (found) return found
      }
    }
  }
  return null
}

export const fetchFileContent = async (file: FileNode): Promise<string> => {
  let fetchPath = ''
  if (file.isSource && file.fetchPath) {
    fetchPath = `./${file.fetchPath}`
  } else {
    // Use raw path directly - files are stored with actual characters, not encoded
    // Encode the path to handle Chinese characters and special symbols in URL
    fetchPath = `./notes/${encodeURI(file.path)}`
  }

  try {
    const res = await fetch(fetchPath)
    
    if (res.ok) return await res.text()
    return `# Error ${res.status}\nCould not load file content.\nPath: ${file.path}`
  } catch (e: any) {
    return `# Error\n${e.message}\nPath: ${file.path}`
  }
}
