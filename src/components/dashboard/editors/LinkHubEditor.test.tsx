import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import LinkHubEditor from './LinkHubEditor'
import type { LinkHub } from '@/lib/types/database'

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

describe('LinkHubEditor', () => {
    const mockData: LinkHub = {
        id: '789',
        tag_id: 'tag-1',
        title: 'My Links',
        bio: 'Check these out',
        avatar_url: null,
        links: [
            { title: 'Google', url: 'https://google.com', icon: '🔍' }
        ],
        theme: null,
        created_at: '',
        updated_at: '',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUpdate.mockReturnValue({ eq: mockEq })
        mockInsert.mockResolvedValue({ error: null })
    })

    it('should render form with existing data', () => {
        render(<LinkHubEditor tagId="tag-1" data={mockData} />)

        expect(screen.getByPlaceholderText('My Links')).toHaveValue('My Links')
        expect(screen.getByPlaceholderText('A short description...')).toHaveValue('Check these out')
        expect(screen.getByDisplayValue('Google')).toBeInTheDocument()
        expect(screen.getByDisplayValue('https://google.com')).toBeInTheDocument()
    })

    it('should update title and bio', () => {
        render(<LinkHubEditor tagId="tag-1" data={null} />)

        const titleInput = screen.getByPlaceholderText('My Links')
        fireEvent.change(titleInput, { target: { value: 'New Title' } })
        expect(titleInput).toHaveValue('New Title')
    })

    it('should add and remove links', () => {
        render(<LinkHubEditor tagId="tag-1" data={null} />)

        expect(screen.getByText(/No links yet/i)).toBeInTheDocument()

        fireEvent.click(screen.getByText('Add Link'))
        expect(screen.queryByText(/No links yet/i)).not.toBeInTheDocument()

        const inputs = screen.getAllByPlaceholderText('Link Title')
        expect(inputs).toHaveLength(1)

        // Remove link - find button with red text class
        const removeButton = screen.getAllByRole('button').find(b => b.className.includes('text-red-500'))
        fireEvent.click(removeButton!)

        expect(screen.getByText(/No links yet/i)).toBeInTheDocument()
    })

    it('should update link fields', () => {
        render(<LinkHubEditor tagId="tag-1" data={null} />)
        fireEvent.click(screen.getByText('Add Link'))

        const titleInput = screen.getByPlaceholderText('Link Title')
        fireEvent.change(titleInput, { target: { value: 'My Site' } })
        expect(titleInput).toHaveValue('My Site')

        const urlInput = screen.getByPlaceholderText('https://...')
        fireEvent.change(urlInput, { target: { value: 'https://mysite.com' } })
        expect(urlInput).toHaveValue('https://mysite.com')
    })

    it('should save existing link hub (update)', async () => {
        render(<LinkHubEditor tagId="tag-1" data={mockData} />)

        const titleInput = screen.getByPlaceholderText('My Links')
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

        fireEvent.click(screen.getByText('Save Link Hub'))

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Updated Title',
            }))
        })
        expect(mockEq).toHaveBeenCalledWith('id', '789')
        expect(mockRefresh).toHaveBeenCalled()
    })

    it('should create new link hub (insert)', async () => {
        render(<LinkHubEditor tagId="tag-1" data={null} />)

        const titleInput = screen.getByPlaceholderText('My Links')
        fireEvent.change(titleInput, { target: { value: 'New Hub' } })

        fireEvent.click(screen.getByText('Add Link'))

        const linkTitleInput = screen.getByPlaceholderText('Link Title')
        fireEvent.change(linkTitleInput, { target: { value: 'Link 1' } })

        fireEvent.click(screen.getByText('Save Link Hub'))

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                tag_id: 'tag-1',
                title: 'New Hub',
                links: expect.arrayContaining([
                    expect.objectContaining({ title: 'Link 1' })
                ])
            }))
        })
        expect(mockRefresh).toHaveBeenCalled()
    })
})
