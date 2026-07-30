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
    // Remove leading slash if present to avoid double slash
    const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    fetchPath = `./notes/${encodeURI(cleanPath)}`
  }

  try {
    const res = await fetch(fetchPath)
    
    if (res.ok) {
      const text = await res.text()
      if (!text) return '# Empty File\nThis file appears to be empty.'
      return text
    }
    return `# Error ${res.status}\nCould not load file content.\nPath: ${fetchPath}`
  } catch (e: unknown) {
    const error = e as Error
    return `# Error\n${error.message}\nPath: ${file.path}`
  }
}

export const fetchRenderedHtml = async (file: FileNode): Promise<string> => {
  const fetchPath = file.renderPath ? `./${file.renderPath}` : ''
  if (!fetchPath) return ''

  try {
    const res = await fetch(fetchPath)
    if (res.ok) return await res.text()
    return ''
  } catch {
    return ''
  }
}
