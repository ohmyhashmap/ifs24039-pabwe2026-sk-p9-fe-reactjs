import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))
import Swal from 'sweetalert2'
import { formatDate, showSuccessAlert, showErrorAlert, showConfirmDialog } from './toolsHelper'

describe('formatDate', () => {
  it('formats valid dates', () => {
    expect(formatDate('2026-01-15T00:00:00Z')).toMatch(/2026/)
    expect(formatDate('2026-01-15T00:00:00Z', 'en-US')).toMatch(/January|2026/)
  })
  it('returns dash for empty or invalid', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('nope')).toBe('-')
  })
})

describe('alerts', () => {
  beforeEach(() => Swal.fire.mockReset())

  it('success alert', async () => {
    Swal.fire.mockResolvedValue({})
    await showSuccessAlert('ok')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', text: 'ok', title: 'Berhasil' }))
    await showSuccessAlert('ok', 'T')
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ title: 'T' }))
  })

  it('error alert', async () => {
    Swal.fire.mockResolvedValue({})
    await showErrorAlert('bad')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', title: 'Gagal' }))
    await showErrorAlert('bad', 'E')
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ title: 'E' }))
  })

  it('confirm dialog', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true })
    expect(await showConfirmDialog('sure?')).toBe(true)
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ confirmButtonText: 'Ya', cancelButtonText: 'Batal' }))
    Swal.fire.mockResolvedValue({ isConfirmed: false })
    expect(await showConfirmDialog('sure?', { title: 'A', confirmText: 'B', cancelText: 'C' })).toBe(false)
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ title: 'A', confirmButtonText: 'B', cancelButtonText: 'C' }))
  })
})
