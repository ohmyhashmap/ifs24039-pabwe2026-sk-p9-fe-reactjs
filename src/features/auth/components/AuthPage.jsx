import { useState } from 'react'
import AuthForm from './AuthForm'

export default function AuthPage({ mode: initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode)
  const isLogin = mode === 'login'

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-6 text-2xl font-bold">{isLogin ? 'Masuk' : 'Daftar'} Delcom Blog</h1>
      <AuthForm mode={mode} onSuccess={onSuccess} />
      <button
        type="button"
        data-testid="switch-mode"
        className="mt-4 text-sm text-[var(--color-accent)]"
        onClick={() => setMode(isLogin ? 'register' : 'login')}
      >
        {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
      </button>
    </div>
  )
}
