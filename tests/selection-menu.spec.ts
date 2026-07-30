import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useSelectionMenu } from '../src/composables/useSelectionMenu'

describe('useSelectionMenu highlight-block & contextmenu', () => {
  let viewer: HTMLDivElement

  beforeEach(() => {
    viewer = document.createElement('div')
    viewer.id = 'markdown-viewer'
    viewer.innerHTML = `
      <p id="p1">hello world</p>
      <p id="p2">second line</p>
    `
    document.body.appendChild(viewer)
  })

  it('adds class to intersecting block elements and clears selection', () => {
    const p1Text = viewer.querySelector('#p1')!.firstChild as Text
    const p2Text = viewer.querySelector('#p2')!.firstChild as Text

    const range = document.createRange()
    range.setStart(p1Text, 1)
    range.setEnd(p2Text, 6)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)

    const { applyFormat } = useSelectionMenu(ref(viewer), () => {})
    applyFormat('highlight-block', 'err')

    expect(viewer.querySelector('#p1')!.classList.contains('sakura-block-highlight')).toBe(true)
    expect(viewer.querySelector('#p2')!.classList.contains('sakura-block-highlight')).toBe(true)
    expect(viewer.querySelectorAll('span.sakura-block-highlight').length).toBe(0)
    expect(window.getSelection()!.rangeCount).toBe(0)

    viewer.remove()
  })

  it('handles contextmenu on viewer and prevents default when there is a selection', () => {
    const text = viewer.querySelector('#p1')!.firstChild as Text
    const range = document.createRange()
    range.setStart(text, 0)
    range.setEnd(text, text.length)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)

    const { handleSelectionContextMenu } = useSelectionMenu(ref(viewer), () => {})

    const preventDefault = vi.fn()
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 10,
      clientY: 10
    }) as MouseEvent
    Object.defineProperty(event, 'preventDefault', { value: preventDefault })

    handleSelectionContextMenu(event)

    expect(preventDefault).toHaveBeenCalled()

    viewer.remove()
  })
})
