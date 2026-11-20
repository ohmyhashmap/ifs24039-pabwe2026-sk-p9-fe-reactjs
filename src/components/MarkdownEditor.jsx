import { useEffect, useRef } from 'react'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

export default function MarkdownEditor({
  value = '',
  onChange,
  darkMode = false,
  height = '400px',
  editType = 'markdown',
}) {
  const containerRef = useRef(null)
  const editorRef = useRef(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const editor = new Editor({
      el: containerRef.current,
      height,
      initialEditType: editType,
      previewStyle: 'vertical',
      initialValue: value,
      theme: darkMode ? 'dark' : 'light',
      events: {
        change: () => onChangeRef.current?.(editor.getMarkdown()),
      },
    })
    editorRef.current = editor
    return () => {
      editor.destroy()
      editorRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode, height, editType])

  useEffect(() => {
    const editor = editorRef.current
    if (editor.getMarkdown() !== value) editor.setMarkdown(value)
  }, [value])

  return <div data-testid="markdown-editor" ref={containerRef} />
}
