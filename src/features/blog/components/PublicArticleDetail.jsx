import { useEffect, useState } from 'react'
import { getPublicPostBySlug } from '../api/blogApi'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleDetail({ slug, navigate, isDark }) {
  // undefined = loading, null = not found
  const [post, setPost] = useState(undefined)

  useEffect(() => {
    const prefetched = window.__PREFETCH_POST_DETAIL__
    delete window.__PREFETCH_POST_DETAIL__
    const request = prefetched || getPublicPostBySlug(slug)
    request.then((res) => setPost(res.status === 'success' ? res.data : null))
  }, [slug])

  if (post === undefined) return <h1 className="p-6 text-center text-xl font-semibold">Memuat...</h1>

  if (post === null) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Artikel tidak ditemukan.</h1>
        <button type="button" className="mt-2 text-[var(--color-accent)]" onClick={() => navigate('/')}>
          Kembali
        </button>
      </div>
    )
  }

  return (
    <article className="w-full px-4 py-6 md:px-10">
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {post.author_name} · {formatDate(post.published_at)} · {post.category} ·{' '}
        {post.reading_time} menit baca
      </p>
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          fetchPriority="high"
          decoding="async"
          className="mb-6 max-h-96 w-full rounded object-cover"
        />
      )}
      <MarkdownViewer content={post.content} darkMode={isDark} />
    </article>
  )
}
