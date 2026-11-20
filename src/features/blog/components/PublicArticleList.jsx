import { useEffect, useState } from 'react'
import { FILTER_CATEGORIES, getPublicPosts, toList } from '../api/blogApi'

export default function PublicArticleList({ navigate }) {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')

  useEffect(() => {
    const prefetched = !search && category === 'Semua' ? window.__PREFETCH_POSTS__ : null
    delete window.__PREFETCH_POSTS__
    const request =
      prefetched || getPublicPosts({ search, category: category === 'Semua' ? '' : category })
    request.then((res) => setPosts(res.status === 'success' ? toList(res.data) : []))
  }, [search, category])

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Jelajahi Artikel</h1>
      <input
        type="search"
        placeholder="Cari artikel..."
        aria-label="Cari artikel"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800"
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className={`rounded-full border px-4 py-1 text-sm ${
              category === name
                ? 'border-transparent bg-[var(--color-accent)] text-white dark:text-slate-950 font-medium'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Belum ada artikel.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              data-testid="article-card"
              className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:shadow dark:border-gray-700"
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              <span className="text-xs text-[var(--color-accent)]">{post.category}</span>
              <h2 className="my-1 text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{post.reading_time} menit baca</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
