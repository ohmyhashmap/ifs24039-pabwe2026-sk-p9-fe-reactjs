import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/blogApi', async (orig) => ({ ...(await orig()), createPost: vi.fn(), updatePost: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ showErrorAlert: vi.fn(), showSuccessAlert: vi.fn() }))
vi.mock('../../../components/MarkdownEditor', () => ({
  default: ({ value, onChange, darkMode }) => (
    <textarea data-testid="editor" data-dark={String(darkMode)} value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))
import { createPost, updatePost } from '../api/blogApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'
import PostModal from './PostModal'

describe('PostModal', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates a new post with defaults and full-width layout', async () => {
    createPost.mockResolvedValue({ status: 'success', message: 'ok' })
    const onSaved = vi.fn()
    const onClose = vi.fn()
    render(<PostModal post={null} isDark onClose={onClose} onSaved={onSaved} />)
    expect(screen.getByText('Tambah Artikel')).toBeInTheDocument()
    expect(document.querySelector('.max-w-\\[96vw\\]')).not.toBeNull()
    expect(await screen.findByTestId('editor')).toHaveAttribute('data-dark', 'true')

    await userEvent.type(screen.getByLabelText('Judul'), 'Hai')
    await userEvent.selectOptions(screen.getByLabelText('Kategori'), 'Bisnis')
    await userEvent.type(screen.getByLabelText('Gambar Sampul'), 'u')
    await userEvent.type(screen.getByLabelText('Ringkasan'), 'r')
    await userEvent.type(screen.getByTestId('editor'), 'c')
    await userEvent.click(screen.getByLabelText('Terbitkan'))
    await userEvent.click(screen.getByText('Simpan'))
    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(createPost).toHaveBeenCalledWith({
      title: 'Hai', category: 'Bisnis', cover_image: 'u', excerpt: 'r', content: 'c', is_published: true,
    })
    expect(showSuccessAlert).toHaveBeenCalledWith('ok')
    await userEvent.click(screen.getByText('Batal'))
    expect(onClose).toHaveBeenCalled()
  })

  it('updates an existing post', async () => {
    updatePost.mockResolvedValue({ status: 'success', message: 'ok' })
    const onSaved = vi.fn()
    const post = { id: 7, title: 'T', category: 'Opini', cover_image: 'c', excerpt: 'e', content: 'k', is_published: true }
    render(<PostModal post={post} isDark={false} onClose={vi.fn()} onSaved={onSaved} />)
    expect(screen.getByText('Ubah Artikel')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveValue('T')
    await userEvent.click(screen.getByText('Simpan'))
    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(updatePost).toHaveBeenCalledWith(7, expect.objectContaining({ title: 'T', is_published: true }))
  })

  it('validates title', async () => {
    render(<PostModal post={null} onClose={vi.fn()} onSaved={vi.fn()} />)
    await userEvent.click(screen.getByText('Simpan'))
    expect(showErrorAlert).toHaveBeenCalledWith('Judul wajib diisi')
    expect(createPost).not.toHaveBeenCalled()
  })

  it('shows API error', async () => {
    createPost.mockResolvedValue({ status: 'error', message: 'gagal' })
    const onSaved = vi.fn()
    render(<PostModal post={null} onClose={vi.fn()} onSaved={onSaved} />)
    await userEvent.type(screen.getByLabelText('Judul'), 'x')
    await userEvent.click(screen.getByText('Simpan'))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('gagal'))
    expect(onSaved).not.toHaveBeenCalled()
  })
})
