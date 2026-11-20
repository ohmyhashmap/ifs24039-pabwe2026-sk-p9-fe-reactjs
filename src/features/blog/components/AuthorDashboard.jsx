import { useEffect, useState } from 'react'
import { deletePost, getMyPosts, getPostStats, toList, togglePublish } from '../api/blogApi'
import PostStats from './PostStats'
import PostModal from '../modals/PostModal'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

export default function AuthorDashboard({ navigate, isDark }) {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({})
  const [menuId, setMenuId] = useState(null)
  const [postModal, setPostModal] = useState(null) // null = closed, { post } = open
  const [aiOpen, setAiOpen] = useState(false)

  const applyData = ([p, s]) => {
    setPosts(p.status === 'success' ? toList(p.data) : [])
    setStats(s.status === 'success' ? s.data || {} : {})
  }

  const load = () => Promise.all([getMyPosts(), getPostStats()]).then(applyData)

  useEffect(() => {
    Promise.all([getMyPosts(), getPostStats()]).then(applyData)
  }, [])

  const handleToggle = async (post) => {
    const res = await togglePublish(post.id)
    if (res.status !== 'success') showErrorAlert(res.message)
    await load()
  }

  const handleDelete = async (post) => {
    setMenuId(null)
    const ok = await showConfirmDialog(`Hapus artikel "${post.title}"?`)
    if (ok) {
      const res = await deletePost(post.id)
      if (res.status === 'success') showSuccessAlert(res.message)
      else showErrorAlert(res.message)
      await load()
    }
  }

  const openPostModal = (post) => {
    setMenuId(null)
    setPostModal({ post })
  }

  const handleSaved = () => {
    setPostModal(null)
    load()
  }

  const handleApply = (result) => {
    setAiOpen(false)
    setPostModal({
      post: {
        title: result.title,
        content: result.content,
        excerpt: result.excerpt,
        category: result.category,
      },
    })
  }

  return (
    <div className="w-full px-4 py-6 md:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Workspace Penulis</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-[var(--color-accent)] px-4 py-2 text-[var(--color-accent)]"
            onClick={() => setAiOpen(true)}
          >
            AI Generator
          </button>
          <button
            type="button"
            className="rounded bg-[var(--color-accent)] px-4 py-2 text-white dark:text-slate-950 font-medium"
            onClick={() => openPostModal(null)}
          >
            Tambah Artikel
          </button>
        </div>
      </div>
      <PostStats total={stats.total} published={stats.published} draft={stats.draft} />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-2">Judul</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Status</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600 dark:text-gray-300">
                  Belum ada artikel.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2">{post.category}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={post.is_published}
                      aria-label={`Ubah status ${post.title}`}
                      onClick={() => handleToggle(post)}
                      className={`relative inline-block h-6 w-11 rounded-full ${
                        post.is_published ? 'bg-[var(--color-accent)]' : 'bg-gray-400'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                          post.is_published ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                    <span className="ml-2">{post.is_published ? 'Terbit' : 'Draf'}</span>
                  </td>
                  <td className="relative p-2">
                    <button
                      type="button"
                      aria-label={`Menu ${post.title}`}
                      onClick={() => setMenuId(menuId === post.id ? null : post.id)}
                    >
                      ⋮
                    </button>
                    {menuId === post.id && (
                      <div className="absolute right-2 z-10 flex flex-col rounded border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-slate-800">
                        <button
                          type="button"
                          className="px-4 py-2 text-left"
                          onClick={() => navigate(`/posts/${post.slug}`)}
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 text-left"
                          onClick={() => openPostModal(post)}
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 text-left text-red-600"
                          onClick={() => handleDelete(post)}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {postModal && (
        <PostModal
          post={postModal.post}
          isDark={isDark}
          onClose={() => setPostModal(null)}
          onSaved={handleSaved}
        />
      )}
      {aiOpen && (
        <AiPostGeneratorModal isDark={isDark} onClose={() => setAiOpen(false)} onApply={handleApply} />
      )}
    </div>
  )
}
