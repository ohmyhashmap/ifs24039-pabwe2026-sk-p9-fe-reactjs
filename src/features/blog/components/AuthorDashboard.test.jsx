import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/blogApi', async (orig) => ({
  ...(await orig()),
  getMyPosts: vi.fn(), getPostStats: vi.fn(), togglePublish: vi.fn(), deletePost: vi.fn(),
}))
vi.mock('../../../helpers/toolsHelper', () => ({
  showConfirmDialog: vi.fn(), showErrorAlert: vi.fn(), showSuccessAlert: vi.fn(),
}))
vi.mock('../modals/PostModal', () => ({
  default: ({ post, onClose, onSaved }) => (
    <div data-testid="post-modal">
      <span data-testid="post-json">{JSON.stringify(post)}</span>
      <button onClick={onClose}>close-post</button>
      <button onClick={onSaved}>saved-post</button>
    </div>
  ),
}))
vi.mock('../modals/AiPostGeneratorModal', () => ({
  default: ({ onClose, onApply }) => (
    <div data-testid="ai-modal">
      <button onClick={onClose}>close-ai</button>
      <button onClick={() => onApply({ title: 'T', content: 'C', excerpt: 'E', category: 'Bisnis' })}>
        apply-ai
      </button>
    </div>
  ),
}))
import { getMyPosts, getPostStats, togglePublish, deletePost } from '../api/blogApi'
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'
import AuthorDashboard from './AuthorDashboard'

const posts = [
  { id: 1, slug: 'a', title: 'Satu', category: 'Bisnis', is_published: true },
  { id: 2, slug: 'b', title: 'Dua', category: 'Opini', is_published: false },
]

const setup = async () => {
  const navigate = vi.fn()
  render(<AuthorDashboard navigate={navigate} isDark={false} />)
  await screen.findByText('Satu')
  return navigate
}

describe('AuthorDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getMyPosts.mockResolvedValue({ status: 'success', data: posts })
    getPostStats.mockResolvedValue({ status: 'success', data: { total: 2, published: 1, draft: 1 } })
    togglePublish.mockResolvedValue({ status: 'success' })
    deletePost.mockResolvedValue({ status: 'success', message: 'dihapus' })
  })

  it('renders stats and rows', async () => {
    await setup()
    expect(screen.getByText('Total Artikel').nextSibling).toHaveTextContent('2')
    expect(screen.getByText('Terbit', { selector: 'span.ml-2' })).toBeInTheDocument()
    expect(screen.getByText('Draf', { selector: 'span.ml-2' })).toBeInTheDocument()
  })

  it('shows empty table and tolerates null stats data on success', async () => {
    getMyPosts.mockResolvedValue({ status: 'error' })
    getPostStats.mockResolvedValue({ status: 'success', data: null })
    render(<AuthorDashboard navigate={vi.fn()} />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
  })

  it('handles failed stats', async () => {
    getPostStats.mockResolvedValue({ status: 'error' })
    await setup()
    expect(screen.getByText('Total Artikel').nextSibling).toHaveTextContent('0')
  })

  it('toggles publish status, with and without error', async () => {
    await setup()
    await userEvent.click(screen.getByLabelText('Ubah status Dua'))
    await waitFor(() => expect(togglePublish).toHaveBeenCalledWith(2))
    expect(showErrorAlert).not.toHaveBeenCalled()
    togglePublish.mockResolvedValue({ status: 'error', message: 'gagal' })
    await userEvent.click(screen.getByLabelText('Ubah status Satu'))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('gagal'))
  })

  it('kebab menu: detail, toggle open/close', async () => {
    const navigate = await setup()
    await userEvent.click(screen.getByLabelText('Menu Satu'))
    await userEvent.click(screen.getByLabelText('Menu Satu'))
    expect(screen.queryByText('Detail')).toBeNull()
    await userEvent.click(screen.getByLabelText('Menu Satu'))
    await userEvent.click(screen.getByText('Detail'))
    expect(navigate).toHaveBeenCalledWith('/posts/a')
  })

  it('kebab menu: edit opens modal with post, close and saved', async () => {
    await setup()
    await userEvent.click(screen.getByLabelText('Menu Dua'))
    await userEvent.click(screen.getByText('Ubah'))
    expect(screen.getByTestId('post-json')).toHaveTextContent('"title":"Dua"')
    await userEvent.click(screen.getByText('close-post'))
    expect(screen.queryByTestId('post-modal')).toBeNull()
    await userEvent.click(screen.getByText('Tambah Artikel'))
    expect(screen.getByTestId('post-json')).toHaveTextContent('null')
    getMyPosts.mockClear()
    await userEvent.click(screen.getByText('saved-post'))
    expect(screen.queryByTestId('post-modal')).toBeNull()
    await waitFor(() => expect(getMyPosts).toHaveBeenCalled())
  })

  it('delete: cancelled, success, and failure', async () => {
    await setup()
    showConfirmDialog.mockResolvedValue(false)
    await userEvent.click(screen.getByLabelText('Menu Satu'))
    await userEvent.click(screen.getByText('Hapus'))
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled())
    expect(deletePost).not.toHaveBeenCalled()

    showConfirmDialog.mockResolvedValue(true)
    await userEvent.click(screen.getByLabelText('Menu Satu'))
    await userEvent.click(screen.getByText('Hapus'))
    await waitFor(() => expect(showSuccessAlert).toHaveBeenCalledWith('dihapus'))

    deletePost.mockResolvedValue({ status: 'error', message: 'nope' })
    await userEvent.click(screen.getByLabelText('Menu Satu'))
    await userEvent.click(screen.getByText('Hapus'))
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('nope'))
  })

  it('AI generator: close and apply to editor', async () => {
    await setup()
    await userEvent.click(screen.getByText('AI Generator'))
    await userEvent.click(screen.getByText('close-ai'))
    expect(screen.queryByTestId('ai-modal')).toBeNull()
    await userEvent.click(screen.getByText('AI Generator'))
    await userEvent.click(screen.getByText('apply-ai'))
    expect(screen.queryByTestId('ai-modal')).toBeNull()
    expect(screen.getByTestId('post-json')).toHaveTextContent('"title":"T"')
    expect(screen.getByTestId('post-json')).toHaveTextContent('"category":"Bisnis"')
  })
})
