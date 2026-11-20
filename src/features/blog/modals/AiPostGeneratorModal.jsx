import { useState } from 'react'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { CATEGORIES, aiGenerate } from '../api/blogApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'

const fieldClass =
  'w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800'

export default function AiPostGeneratorModal({ isDark, onClose, onApply }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('Umum')
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleGenerate = async () => {
    if (topic.trim()) {
      setLoading(true)
      const res = await aiGenerate({ topic, category, include_web_search: includeWebSearch })
      setLoading(false)
      if (res.status === 'success') setResult(res.data)
      else showErrorAlert(res.message)
    } else {
      showErrorAlert('Topik wajib diisi')
    }
  }

  const sources = (result && result.search_sources) || []

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2"
    >
      <div className="flex max-h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-900">
        <header className="bg-[var(--color-accent)] px-6 py-4 text-white dark:text-slate-950 font-medium">
          <h2 className="text-xl font-bold">AI Generator</h2>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          <input
            aria-label="Topik"
            placeholder="Topik artikel"
            className={fieldClass}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <select
            aria-label="Kategori"
            className={fieldClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeWebSearch}
              onChange={(e) => setIncludeWebSearch(e.target.checked)}
            />
            Sertakan penelusuran web
          </label>
          <button
            type="button"
            disabled={loading}
            className="rounded bg-[var(--color-accent)] px-4 py-2 text-white dark:text-slate-950 font-medium disabled:opacity-50"
            onClick={handleGenerate}
          >
            {loading ? 'Membuat...' : 'Generate'}
          </button>
          {result && (
            <section data-testid="ai-preview" className="rounded border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-2 text-lg font-semibold">{result.title}</h3>
              <MarkdownViewer content={result.content} darkMode={isDark} />
              {sources.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold">Sumber Penelusuran</h4>
                  <ul className="list-disc pl-5">
                    {sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noreferrer" className="text-[var(--color-accent)]">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
        <footer className="flex justify-end gap-2 bg-slate-200 px-6 py-4 dark:bg-slate-800">
          <button type="button" className="rounded border border-gray-400 px-4 py-2" onClick={onClose}>
            Batal
          </button>
          {result && (
            <button
              type="button"
              className="rounded bg-[var(--color-accent)] px-4 py-2 text-white dark:text-slate-950 font-medium"
              onClick={() => onApply(result)}
            >
              Terapkan ke Editor
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
