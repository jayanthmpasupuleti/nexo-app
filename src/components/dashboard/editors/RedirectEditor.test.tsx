import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import RedirectEditor from './RedirectEditor'
import type { CustomRedirect } from '@/lib/types/database'

// Mock useRouter
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: mockRefresh,
    }),
}))

// Mock Supabase
const mockUpdate = vi.fn()
const mockInsert = vi.fn()
const mockEq = vi.fn()
const mockFrom = vi.fn(() => ({
    update: mockUpdate,
    insert: mockInsert,
    eq: mockEq,
}))

vi.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}))

describe('RedirectEditor', () => {
    const mockData: CustomRedirect = {
        id: '999',
        tag_id: 'tag-1',
        url: 'https://example.com',
        created_at: '',
        updated_at: '',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUpdate.mockReturnValue({ eq: mockEq })
        mockInsert.mockResolvedValue({ error: null })
    })

    it('should render form with existing data', () => {
        render(<RedirectEditor tagId="tag-1" data={mockData} />)

        expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
        expect(screen.getByText('Save Redirect')).toBeEnabled()
    })

    it('should disable save button when url is empty', () => {
        render(<RedirectEditor tagId="tag-1" data={null} />)

        const input = screen.getByPlaceholderText('https://example.com')
        expect(input).toHaveValue('')
        expect(screen.getByText('Save Redirect').closest('button')).toBeDisabled()

        fireEvent.change(input, { target: { value: 'https://new.com' } })
        expect(screen.getByText('Save Redirect').closest('button')).toBeEnabled()
    })

    it('should save existing redirect (update)', async () => {
        render(<RedirectEditor tagId="tag-1" data={mockData} />)

        const input = screen.getByPlaceholderText('https://example.com')
        fireEvent.change(input, { target: { value: 'https://updated.com' } })

        fireEvent.click(screen.getByText('Save Redirect'))

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({
                url: 'https://updated.com'
            })
        })
        expect(mockEq).toHaveBeenCalledWith('id', '999')
        expect(mockRefresh).toHaveBeenCalled()
    })

    it('should create new redirect (insert)', async () => {
        render(<RedirectEditor tagId="tag-1" data={null} />)

        const input = screen.getByPlaceholderText('https://example.com')
        fireEvent.change(input, { target: { value: 'https://new.com' } })

        fireEvent.click(screen.getByText('Save Redirect'))

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith({
                tag_id: 'tag-1',
                url: 'https://new.com'
            })
        })
        expect(mockRefresh).toHaveBeenCalled()
    })
})
