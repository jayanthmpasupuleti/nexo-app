import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import BusinessCardEditor from './BusinessCardEditor'
import type { BusinessCard } from '@/lib/types/database'

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

// Mock AvatarUpload
vi.mock('../AvatarUpload', () => ({
    default: ({ onAvatarChange }: { onAvatarChange: (url: string) => void }) => (
        <button onClick={() => onAvatarChange('new-avatar-url')}>Change Avatar</button>
    ),
}))

describe('BusinessCardEditor', () => {
    const mockData: BusinessCard = {
        id: '123',
        tag_id: 'tag-1',
        name: 'John Doe',
        title: 'Developer',
        company: 'Tech Co',
        email: 'john@example.com',
        phone: '1234567890',
        website: 'https://example.com',
        linkedin: 'https://linkedin.com/in/john',
        bio: 'Hello world',
        avatar_url: 'old-avatar-url',
        theme: null,
        created_at: '',
        updated_at: '',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Setup chain for update: from().update().eq()
        mockUpdate.mockReturnValue({ eq: mockEq })
        // Setup chain for insert: from().insert()
        mockInsert.mockResolvedValue({ error: null })
    })

    it('should render form with existing data', () => {
        render(<BusinessCardEditor tagId="tag-1" data={mockData} />)

        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Developer')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Tech Co')).toBeInTheDocument()
        expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    })

    it('should render empty form when no data provided', () => {
        const { container } = render(<BusinessCardEditor tagId="tag-1" data={null} />)

        // BusinessCardEditor uses InputField helper without valid labels (no htmlFor).
        // So we use container querySelectorByName, or just rely on finding by empty string (risky).
        // Let's use name selector.
        expect(container.querySelector('input[name="name"]')).toHaveValue('')
        expect(container.querySelector('input[name="title"]')).toHaveValue('')
    })

    it('should update form fields', () => {
        const { container } = render(<BusinessCardEditor tagId="tag-1" data={null} />)

        const nameInput = container.querySelector('input[name="name"]')!
        fireEvent.change(nameInput, { target: { value: 'New Name' } })
        expect(nameInput).toHaveValue('New Name')
    })

    it('should handle avatar change', () => {
        render(<BusinessCardEditor tagId="tag-1" data={null} />)

        fireEvent.click(screen.getByText('Change Avatar'))
        // No direct visual output unless we inspect state, but we can verify it's included in save
    })

    it('should save existing business card (update)', async () => {
        const { container } = render(<BusinessCardEditor tagId="tag-1" data={mockData} />)

        const nameInput = container.querySelector('input[name="name"]')!
        fireEvent.change(nameInput, { target: { value: 'Updated Name' } })

        fireEvent.click(screen.getByText('Save Business Card'))

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Updated Name',
                title: 'Developer',
            }))
        })
        expect(mockEq).toHaveBeenCalledWith('id', '123')
        expect(mockRefresh).toHaveBeenCalled()
    })

    it('should create new business card (insert)', async () => {
        const { container } = render(<BusinessCardEditor tagId="tag-1" data={null} />)

        const nameInput = container.querySelector('input[name="name"]')!
        fireEvent.change(nameInput, { target: { value: 'New User' } })

        const emailInput = container.querySelector('input[name="email"]')!
        fireEvent.change(emailInput, { target: { value: 'new@example.com' } })

        fireEvent.click(screen.getByText('Save Business Card'))

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                tag_id: 'tag-1',
                name: 'New User',
                email: 'new@example.com',
            }))
        })
        expect(mockRefresh).toHaveBeenCalled()
    })
})
