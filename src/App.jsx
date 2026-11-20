import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import useTheme from './hooks/useTheme'
import { clearSession, getUser } from './helpers/apiHelper'
import { logout } from './features/auth/api/authApi'
import StickyNavbar from './features/blog/components/StickyNavbar'
import PublicArticleList from './features/blog/components/PublicArticleList'
import AuthPage from './features/auth/components/AuthPage'

const PublicArticleDetail = lazy(() => import('./features/blog/components/PublicArticleDetail'))
const AuthorDashboard = lazy(() => import('./features/blog/components/AuthorDashboard'))
const AdminDashboard = lazy(() => import('./features/admin/components/AdminDashboard'))

const POST_ROUTE = /^\/posts\/([^/]+)$/

const getRedirect = (path, user) => {
  if (path === '/author') return user ? null : '/login'
  if (path === '/admin') {
    if (!user) return '/login'
    return user.role === 'admin' ? null : '/'
  }
  return null
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [user, setUserState] = useState(getUser)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => {
    window.history.pushState({}, '', to)
    setPath(to)
  }, [])

  const activePath = getRedirect(path, user) || path
  useEffect(() => {
    if (activePath !== path) {
      window.history.replaceState({}, '', activePath)
    }
  }, [activePath, path])

  const handleLogin = () => {
    const u = getUser()
    setUserState(u)
    navigate(u?.role === 'admin' ? '/admin' : '/author')
  }

  const handleLogout = async () => {
    await logout()
    clearSession()
    setUserState(null)
    navigate('/')
  }

  const renderRoute = () => {
    const postMatch = activePath.match(POST_ROUTE)
    if (activePath === '/' || activePath === '/public') return <PublicArticleList navigate={navigate} />
    if (postMatch) {
      return (
        <PublicArticleDetail
          slug={decodeURIComponent(postMatch[1])}
          navigate={navigate}
          isDark={isDark}
        />
      )
    }
    if (activePath === '/author') {
      return <AuthorDashboard navigate={navigate} isDark={isDark} />
    }
    if (activePath === '/admin') {
      return <AdminDashboard />
    }
    if (activePath === '/login') return <AuthPage mode="login" onSuccess={handleLogin} />
    if (activePath === '/register') {
      return <AuthPage mode="register" onSuccess={() => navigate('/login')} />
    }
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Halaman tidak ditemukan.</h1>
        <button type="button" className="mt-2 text-[var(--color-accent)]" onClick={() => navigate('/')}>
          Ke Beranda
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StickyNavbar
        user={user}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        navigate={navigate}
      />
      <main className="flex-1">
        <Suspense fallback={<div className="p-6">Memuat...</div>}>{renderRoute()}</Suspense>
      </main>
    </div>
  )
}