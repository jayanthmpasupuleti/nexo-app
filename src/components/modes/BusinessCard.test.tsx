import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import BusinessCardMode from './BusinessCard'
import type { BusinessCard } from '@/lib/types/database'

describe('BusinessCardMode', () => {
    const mockData: BusinessCard = {
        id: '1',
        tag_id: 'tag-1',
        name: 'John Doe',
        title: 'Software Engineer',
        company: 'Tech Corp',
        email: 'john@example.com',
        phone: '+1234567890',
        website: 'https://example.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        bio: 'Coding enthusiast',
        avatar_url: 'https://example.com/avatar.jpg',
        theme: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    }

    // Mock clipboard and URL APIs
    const mockWriteText = vi.fn()
    const mockCreateObjectURL = vi.fn()
    const mockRevokeObjectURL = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        Object.assign(navigator, {
            clipboard: {
                writeText: mockWriteText,
            },
        })
        global.URL.createObjectURL = mockCreateObjectURL
        global.URL.revokeObjectURL = mockRevokeObjectURL
    })

    it('should render all profile information correctly', () => {
        render(<BusinessCardMode data={mockData} />)

        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Software Engineer · Tech Corp')).toBeInTheDocument()
        expect(screen.getByText('Coding enthusiast')).toBeInTheDocument()

        // Avatar check - using alt text
        expect(screen.getByAltText('John Doe')).toBeInTheDocument()
    })

    it('should render all contact links', () => {
        render(<BusinessCardMode data={mockData} />)

        expect(screen.getByText('john@example.com')).toBeInTheDocument()
        expect(screen.getByText('+1234567890')).toBeInTheDocument()
        expect(screen.getByText('example.com')).toBeInTheDocument()
        expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    })

    it('should copy email to clipboard', async () => {
        render(<BusinessCardMode data={mockData} />)

        const emailButton = screen.getByText('john@example.com').closest('button')
        fireEvent.click(emailButton!)

        expect(mockWriteText).toHaveBeenCalledWith('john@example.com')
        expect(await screen.findByText('Copied!')).toBeInTheDocument()
    })

    it('should generate and download VCard on save', () => {
        // Spy on HTMLAnchorElement.prototype.click to detect when the hidden link is clicked
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click')

        render(<BusinessCardMode data={mockData} />)

        const saveButton = screen.getByText('Save Contact')
        fireEvent.click(saveButton)

        expect(mockCreateObjectURL).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()

        // Check the element that was clicked
        const clickedLink = clickSpy.mock.instances[0] as HTMLAnchorElement
        expect(clickedLink.download).toBe('John Doe.vcf')
        expect(mockRevokeObjectURL).toHaveBeenCalled()

        clickSpy.mockRestore()
    })

    it('should handle minimal data gracefully', () => {
        const minimalData: BusinessCard = {
            id: '2',
            tag_id: 'tag-2',
            name: 'Jane Doe',
            title: null,
            company: null,
            email: null,
            phone: null,
            website: null,
            linkedin: null,
            bio: null,
            avatar_url: null,
            theme: null,
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
        }

        render(<BusinessCardMode data={minimalData} />)

        expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        // Should show initial as avatar
        expect(screen.getByText('J')).toBeInTheDocument()
        // Should not render missing fields
        expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
    })
})
