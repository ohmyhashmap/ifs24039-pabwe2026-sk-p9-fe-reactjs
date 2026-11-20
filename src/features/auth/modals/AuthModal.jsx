import { useState } from 'react'
import AuthForm from '../components/AuthForm'

export default function AuthModal({ open, onClose, mode: initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode)
  if (!open) return null
  const isLogin = mode === 'login'

  const handleSuccess = (data) => {
    onSuccess?.(data)
    onClose?.()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{isLogin ? 'Masuk' : 'Daftar'}</h2>
          <button type="button" aria-label="Tutup" data-testid="close-modal" onClick={onClose}>
            ✕
          </button>
        </div>
        <AuthForm mode={mode} onSuccess={handleSuccess} />
        <button
          type="button"
          data-testid="switch-mode"
          className="mt-4 text-sm text-[var(--color-accent)]"
          onClick={() => setMode(isLogin ? 'register' : 'login')}
        >
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
    </div>
  )
}
