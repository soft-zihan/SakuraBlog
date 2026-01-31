import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useContentClick } from '../src/composables/useContentClick'
import { useContentRenderer } from '../src/composables/useContentRenderer'
import { NodeType, type FileNode } from '../src/types'

describe('Content Click Integration', () => {
  it('opens code link with anchor and injects snippet', async () => {
    const currentFile = ref<FileNode | null>({
      name: 'current.md',
      path: 'notes/zh/current.md',
      type: NodeType.FILE
    })

    const codeContent = [
      'export function targetFn() {',
      '  const a = 1',
      '}',
      '',
      'export const other = 2'
    ].join('\n')

    const codeNode: FileNode = {
      name: 'test.ts',
      path: 'src/composables/test.ts',
      type: NodeType.FILE,
      content: codeContent
    }

    const fileSystem = ref<FileNode[]>([codeNode])
    const findNodeByPath = vi.fn((nodes: FileNode[], path: string) => nodes.find(n => n.path === path) || null)
    const fetchFileContent = vi.fn(async (file: FileNode) => file.content || '')
    const openFile = vi.fn(async () => undefined)
    const openCodeModal = vi.fn(async () => undefined)
    const setCodeModalContent = vi.fn()
    const fetchSourceCodeFile = vi.fn(async () => '')
    const handleImageClick = vi.fn(() => false)
    const hideSelectionMenu = vi.fn()
    const showToast = vi.fn()

    const { handleContentClick } = useContentClick(
      currentFile,
      fileSystem,
      findNodeByPath,
      fetchFileContent,
      openFile,
      openCodeModal,
      setCodeModalContent,
      fetchSourceCodeFile,
      handleImageClick,
      hideSelectionMenu,
      showToast
    )

    const link = document.createElement('a')
    link.setAttribute('href', 'code://src/composables/test.ts#targetFn')
    const event = {
      target: link,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    } as unknown as MouseEvent

    await handleContentClick(event, false)

    expect(openCodeModal).toHaveBeenCalledWith('test.ts → targetFn', 'Loading...', 'src/composables/test.ts')
    expect(setCodeModalContent).toHaveBeenCalled()
    const snippet = setCodeModalContent.mock.calls[0][0]
    if (snippet.includes('1 |')) {
      expect(snippet).toContain('1 | export function targetFn()')
      expect(snippet).toContain('2 |   const a = 1')
    } else {
      expect(snippet).toContain('export function targetFn()')
      expect(snippet).toContain('const a = 1')
    }
    expect(hideSelectionMenu).toHaveBeenCalled()
  })

  it('resolves relative links against current file path', () => {
    const currentFile = ref<FileNode | null>(null)
    const fileSystem = ref<FileNode[]>([])
    const noopAsync = async () => undefined

    const { resolveTargetPath } = useContentClick(
      currentFile,
      fileSystem,
      () => null,
      async () => '',
      noopAsync,
      noopAsync,
      () => undefined,
      async () => '',
      () => false,
      () => undefined,
      () => undefined
    )

    const resolved = resolveTargetPath('../assets/pic.png', 'notes/zh/guide/readme.md')
    expect(resolved).toBe('notes/zh/assets/pic.png')
  })
})

describe('Content Renderer Integration', () => {
  it('renders internal links and pdf embeds correctly', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const currentFile = ref<FileNode | null>({
      name: 'guide.md',
      path: 'notes/zh/guide.md',
      type: NodeType.FILE,
      content: 'See [Doc](notes/guide.md)\n\n[PDF](docs/test.pdf)'
    })
    const isRawMode = ref(false)

    const { setupMarkedRenderer, updateRenderedContent, renderedHtml } = useContentRenderer(currentFile, isRawMode)
    setupMarkedRenderer()
    await updateRenderedContent()

    expect(renderedHtml.value).toContain('data-internal-href="notes/guide.md"')
    expect(renderedHtml.value).toContain('pdf-embed')
    expect(renderedHtml.value).toContain('<iframe')
    warnSpy.mockRestore()
  })
})
