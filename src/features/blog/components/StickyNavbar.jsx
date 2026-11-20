const linkClass = 'rounded px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10'

export default function StickyNavbar({ user, isDark, onToggleTheme, onLogout, navigate }) {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-2 backdrop-blur dark:border-gray-700 dark:bg-slate-900/90">
      <button
        type="button"
        className="text-lg font-bold text-[var(--color-accent)]"
        onClick={() => navigate('/')}
      >
        Delcom Blog
      </button>
      <div className="flex items-center gap-1">
        {user ? (
          <>
            <button type="button" className={linkClass} onClick={() => navigate('/author')}>
              Workspace Penulis
            </button>
            {user.role === 'admin' && (
              <button type="button" className={linkClass} onClick={() => navigate('/admin')}>
                Admin
              </button>
            )}
            <button type="button" className={linkClass} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" className={linkClass} onClick={() => navigate('/login')}>
              Login
            </button>
            <button type="button" className={linkClass} onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
        <button type="button" aria-label="Ganti tema" className={linkClass} onClick={onToggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}
