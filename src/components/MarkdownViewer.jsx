function parseBlock(block, index) {
  if (block.startsWith('### ')) {
    return (
      <h3 key={index} className="mt-4 mb-2 text-lg font-semibold">
        {block.slice(4)}
      </h3>
    )
  }
  if (block.startsWith('## ')) {
    return (
      <h2 key={index} className="mt-5 mb-2 text-xl font-bold">
        {block.slice(3)}
      </h2>
    )
  }
  if (block.startsWith('# ')) {
    return (
      <h2 key={index} className="mt-6 mb-3 text-2xl font-bold">
        {block.slice(2)}
      </h2>
    )
  }
  if (block.startsWith('- ')) {
    const items = block.split('\n').map((line) => line.replace(/^- /, ''))
    return (
      <ul key={index} className="my-2 list-disc pl-5">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <p key={index} className="my-2 leading-relaxed whitespace-pre-wrap">
      {block}
    </p>
  )
}

export default function MarkdownViewer({ content = '', darkMode = false }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)

  return (
    <div
      data-testid="markdown-viewer"
      data-theme={darkMode ? 'dark' : 'light'}
      className={`w-full max-w-full overflow-x-auto break-words ${
        darkMode ? 'text-gray-100' : 'text-gray-800'
      }`}
    >
      {blocks.map(parseBlock)}
    </div>
  )
}
