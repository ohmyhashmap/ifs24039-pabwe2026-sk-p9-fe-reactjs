import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

const instances = []
vi.mock('@toast-ui/editor', () => ({
  default: class {
    constructor(opts) {
      this.opts = opts
      this.md = opts.initialValue
      this.destroy = vi.fn()
      this.setMarkdown = vi.fn((v) => { this.md = v })
      instances.push(this)
    }
    getMarkdown() { return this.md }
  },
}))
vi.mock('@toast-ui/editor/dist/toastui-editor.css', () => ({}))
vi.mock('@toast-ui/editor/dist/theme/toastui-editor-dark.css', () => ({}))

import MarkdownEditor from './MarkdownEditor'

describe('MarkdownEditor', () => {
  beforeEach(() => { instances.length = 0 })

  it('renders with defaults', () => {
    const { getByTestId, unmount } = render(<MarkdownEditor />)
    expect(getByTestId('markdown-editor')).toBeInTheDocument()
    const ed = instances[0]
    expect(ed.opts.theme).toBe('light')
    expect(ed.opts.height).toBe('400px')
    expect(ed.opts.initialEditType).toBe('markdown')
    expect(ed.opts.previewStyle).toBe('vertical')
    ed.opts.events.change() // no onChange handler
    unmount()
    expect(ed.destroy).toHaveBeenCalled()
  })

  it('calls onChange, supports dark mode and syncs value', () => {
    const onChange = vi.fn()
    const { rerender } = render(<MarkdownEditor value="a" onChange={onChange} darkMode />)
    const ed = instances[0]
    expect(ed.opts.theme).toBe('dark')
    ed.md = 'typed'
    ed.opts.events.change()
    expect(onChange).toHaveBeenCalledWith('typed')

    rerender(<MarkdownEditor value="typed" onChange={onChange} darkMode />)
    expect(ed.setMarkdown).not.toHaveBeenCalled()
    rerender(<MarkdownEditor value="external" onChange={onChange} darkMode />)
    expect(ed.setMarkdown).toHaveBeenCalledWith('external')

    rerender(<MarkdownEditor value="external" onChange={onChange} darkMode={false} />)
    expect(ed.destroy).toHaveBeenCalled()
    expect(instances.length).toBe(2)
  })
})
