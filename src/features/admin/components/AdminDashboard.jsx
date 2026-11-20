import { useEffect, useState } from 'react'
import { getAllPosts, getUserPosts, getUsers } from '../api/adminApi'
import { toList } from '../../blog/api/blogApi'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [filterUser, setFilterUser] = useState(null)

  const applyAll = ([u, p]) => {
    setUsers(u.status === 'success' ? toList(u.data) : [])
    setPosts(p.status === 'success' ? toList(p.data) : [])
    setFilterUser(null)
  }

  const load = () => Promise.all([getUsers(), getAllPosts()]).then(applyAll)

  useEffect(() => {
    Promise.all([getUsers(), getAllPosts()]).then(applyAll)
  }, [])

  const showUserPosts = async (user) => {
    const res = await getUserPosts(user.id)
    setPosts(res.status === 'success' ? toList(res.data) : [])
    setFilterUser(user)
  }

  const published = posts.filter((p) => p.is_published).length
  const cards = [
    { label: 'Total Pengguna', value: users.length },
    { label: 'Total Artikel', value: posts.length },
    { label: 'Total Terbit', value: published },
  ]

  return (
    <div className="w-full px-4 py-6 md:px-10">
      <h1 className="mb-6 text-2xl font-bold">Panel Administrasi</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">{c.label}</p>
            <p className="text-3xl font-bold text-[var(--color-accent)]">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-xl font-semibold">Pengguna</h2>
      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-2">ID</th>
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Total Artikel</th>
              <th className="p-2">Total Terbit</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.total_posts}</td>
                <td className="p-2">{u.published_posts}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-[var(--color-accent)]"
                    onClick={() => showUserPosts(u)}
                  >
                    Lihat Artikel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {filterUser ? `Artikel ${filterUser.username}` : 'Arsip Semua Artikel'}
        </h2>
        {filterUser && (
          <button type="button" className="text-[var(--color-accent)]" onClick={load}>
            Tampilkan Semua
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-2">Judul</th>
              <th className="p-2">Penulis</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.author_name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.is_published ? 'Terbit' : 'Draf'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
