import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/blogApi', async (orig) => ({ ...(await orig()), aiGenerate: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ showErrorAlert: vi.fn() }))
vi.mock('../../../components/MarkdownViewer', () => ({
  default: ({ content }) => <div data-testid="viewer">{content}</div>,
}))
import { aiGenerate } from '../api/blogApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'
import AiPostGeneratorModal from './AiPostGeneratorModal'

const generate = async () => {
  await userEvent.type(screen.getByLabelText('Topik'), 'AI')
  await userEvent.click(screen.getByText('Generate'))
}

describe('AiPostGeneratorModal', () => {
  beforeEach(() => vi.clearAllMocks())

  it('validates topic', async () => {
    render(<AiPostGeneratorModal onClose={vi.fn()} onApply={vi.fn()} />)
    await userEvent.click(screen.getByText('Generate'))
    expect(showErrorAlert).toHaveBeenCalledWith('Topik wajib diisi')
    expect(aiGenerate).not.toHaveBeenCalled()
    expect(screen.queryByText('Terapkan ke Editor')).toBeNull()
  })

  it('generates with sources, applies and closes', async () => {
    const data = {
      title: 'Hasil', content: '# md',
      search_sources: [{ title: 'Src', url: 'http://s' }],
    }
    aiGenerate.mockResolvedValue({ status: 'success', data })
    const onApply = vi.fn()
    const onClose = vi.fn()
    render(<AiPostGeneratorModal isDark onClose={onClose} onApply={onApply} />)
    await userEvent.selectOptions(screen.getByLabelText('Kategori'), 'Teknologi')
    await userEvent.click(screen.getByLabelText('Sertakan penelusuran web'))
    await generate()
    expect(await screen.findByText('Hasil')).toBeInTheDocument()
    expect(aiGenerate).toHaveBeenCalledWith({ topic: 'AI', category: 'Teknologi', include_web_search: true })
    expect(await screen.findByTestId('viewer')).toHaveTextContent('# md')
    expect(screen.getByText('Sumber Penelusuran')).toBeInTheDocument()
    expect(screen.getByText('Src')).toHaveAttribute('href', 'http://s')
    await userEvent.click(screen.getByText('Terapkan ke Editor'))
    expect(onApply).toHaveBeenCalledWith(data)
    await userEvent.click(screen.getByText('Batal'))
    expect(onClose).toHaveBeenCalled()
  })

  it('hides sources when none', async () => {
    aiGenerate.mockResolvedValue({ status: 'success', data: { title: 'H', content: 'c' } })
    render(<AiPostGeneratorModal onClose={vi.fn()} onApply={vi.fn()} />)
    await generate()
    await screen.findByText('H')
    expect(screen.queryByText('Sumber Penelusuran')).toBeNull()
  })

  it('shows API error', async () => {
    aiGenerate.mockResolvedValue({ status: 'error', message: 'rusak' })
    render(<AiPostGeneratorModal onClose={vi.fn()} onApply={vi.fn()} />)
    await generate()
    await waitFor(() => expect(showErrorAlert).toHaveBeenCalledWith('rusak'))
    expect(screen.queryByTestId('ai-preview')).toBeNull()
  })
})
