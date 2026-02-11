import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DashboardPage from './page'
import type { Tag } from '@/lib/types/database'

// Mock createClient from server
const { mockSelect, mockFrom } = vi.hoisted(() => {
    const mockSelect = vi.fn()
    const mockFrom = vi.fn(() => ({
        select: mockSelect,
    }))
    return { mockSelect, mockFrom }
})

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve({
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
        },
        from: mockFrom,
    })),
}))

// Mock TagCard to avoid testing child implementation details
vi.mock('@/components/dashboard/TagCard', () => ({
    default: ({ tag }: { tag: Tag }) => <div data-testid="tag-card">{tag.label}</div>,
}))

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render empty state when no tags are found', async () => {
        // Mock chain for empty tags
        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
        })

        const jsx = await DashboardPage()
        render(jsx)

        expect(screen.getByText('No tags yet')).toBeInTheDocument()
        expect(screen.getByText('Create your first NFC tag to start sharing your digital identity.')).toBeInTheDocument()
    })

    it('should render tag list when tags exist', async () => {
        const mockTags: Tag[] = [
            {
                id: '1',
                user_id: 'user-123',
                label: 'Work Tag',
                code: 'ABC',
                active_mode: 'business_card',
                is_active: true,
                tap_count: 5,
                created_at: '',
                updated_at: '',
            },
            {
                id: '2',
                user_id: 'user-123',
                label: 'Personal Tag',
                code: 'XYZ',
                active_mode: 'wifi',
                is_active: false,
                tap_count: 0,
                created_at: '',
                updated_at: '',
            },
        ]

        // Mock chain for populated tags
        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: mockTags, error: null }),
            }),
        })

        const jsx = await DashboardPage()
        render(jsx)

        expect(screen.getByText('Your Tags')).toBeInTheDocument()
        const cards = screen.getAllByTestId('tag-card')
        expect(cards).toHaveLength(2)
        expect(screen.getByText('Work Tag')).toBeInTheDocument()
        expect(screen.getByText('Personal Tag')).toBeInTheDocument()
    })

    it('should handle fetch errors gracefully', async () => {
        // Mock chain for error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: null, error: 'Database error' }),
            }),
        })

        const jsx = await DashboardPage()
        render(jsx)

        // It should probably still render the page structure, just empty tags
        expect(screen.getByText('Your Tags')).toBeInTheDocument()
        expect(screen.getByText('No tags yet')).toBeInTheDocument() // Falls back to empty state
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching tags:', 'Database error')

        consoleSpy.mockRestore()
    })
})
