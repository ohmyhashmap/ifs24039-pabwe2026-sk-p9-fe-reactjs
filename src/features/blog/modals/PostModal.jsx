import { Suspense, lazy, useState } from 'react'
import { CATEGORIES, createPost, updatePost } from '../api/blogApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

const MarkdownEditor = lazy(() => import('../../../components/MarkdownEditor'))

const fieldClass =
  'w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800'

export default function PostModal({ post, isDark, onClose, onSaved }) {
  const p = post || {}
  const [title, setTitle] = useState(p.title || '')
  const [category, setCategory] = useState(p.category || 'Umum')
  const [coverImage, setCoverImage] = useState(p.cover_image || '')
  const [excerpt, setExcerpt] = useState(p.excerpt || '')
  const [content, setContent] = useState(p.content || '')
  const [isPublished, setIsPublished] = useState(Boolean(p.is_published))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (title.trim()) {
      setSaving(true)
      const payload = {
        title,
        category,
        cover_image: coverImage,
        excerpt,
        content,
        is_published: isPublished,
      }
      const res = p.id ? await updatePost(p.id, payload) : await createPost(payload)
      setSaving(false)
      if (res.status === 'success') {
        showSuccessAlert(res.message)
        onSaved()
      } else {
        showErrorAlert(res.message)
      }
    } else {
      showErrorAlert('Judul wajib diisi')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2"
    >
      <div className="flex max-h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-900">
        <header className="bg-[var(--color-accent)] px-6 py-4 text-white dark:text-slate-950 font-medium">
          <h2 className="text-xl font-bold">{p.id ? 'Ubah Artikel' : 'Tambah Artikel'}</h2>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          <input
            aria-label="Judul"
            placeholder="Judul"
            className={fieldClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <input
            aria-label="Gambar Sampul"
            placeholder="URL gambar sampul"
            className={fieldClass}
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <textarea
            aria-label="Ringkasan"
            placeholder="Ringkasan"
            className={fieldClass}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <Suspense fallback={<div className="py-4 text-sm text-gray-600 dark:text-gray-300">Memuat konten...</div>}>
            <MarkdownEditor value={content} onChange={setContent} darkMode={isDark} />
          </Suspense>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Terbitkan
          </label>
        </div>
        <footer className="flex justify-end gap-2 bg-slate-200 px-6 py-4 dark:bg-slate-800">
          <button type="button" className="rounded border border-gray-400 px-4 py-2" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            disabled={saving}
            className="rounded bg-[var(--color-accent)] px-4 py-2 text-white dark:text-slate-950 font-medium disabled:opacity-50"
            onClick={handleSave}
          >
            Simpan
          </button>
        </footer>
      </div>
    </div>
  )
}
