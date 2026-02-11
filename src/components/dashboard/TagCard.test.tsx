import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TagCard from './TagCard'
import type { Tag } from '@/lib/types/database'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

// Mock QRCodeDisplay
vi.mock('@/components/common/QRCodeDisplay', () => ({
    default: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="qr-modal">
            <button onClick={onClose}>Close QR</button>
        </div>
    ),
}))

// Mock getTagUrl
vi.mock('@/lib/utils/tag-codes', () => ({
    getTagUrl: (code: string) => `https://nexo.app/t/${code}`,
}))

describe('TagCard', () => {
    const mockTag: Tag = {
        id: 'tag-123',
        user_id: 'user-1',
        label: 'My Tag',
        code: 'ABC12345',
        active_mode: 'business_card',
        is_active: true,
        tap_count: 10,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render tag details correctly', () => {
        render(<TagCard tag={mockTag} index={0} />)

        expect(screen.getByText('My Tag')).toBeInTheDocument()
        expect(screen.getByText('Business Card')).toBeInTheDocument()
        expect(screen.getByText('ABC12345')).toBeInTheDocument()
        expect(screen.getByText('10 taps')).toBeInTheDocument()
        expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should render inactive status correctly', () => {
        const inactiveTag = { ...mockTag, is_active: false }
        render(<TagCard tag={inactiveTag} index={1} />)

        expect(screen.getByText('Inactive')).toBeInTheDocument()
    })

    it('should render correct link to tag details', () => {
        render(<TagCard tag={mockTag} index={0} />)

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/dashboard/tags/tag-123')
    })

    it('should show QR modal when clicking the QR button', () => {
        render(<TagCard tag={mockTag} index={0} />)

        // The button is initially hidden/opacity 0 but present in DOM
        const qrButton = screen.getByTitle('Show QR Code')
        fireEvent.click(qrButton)

        expect(screen.getByTestId('qr-modal')).toBeInTheDocument()
    })

    it('should close QR modal when onClose is called', () => {
        render(<TagCard tag={mockTag} index={0} />)

        const qrButton = screen.getByTitle('Show QR Code')
        fireEvent.click(qrButton) // Open it

        const closeButton = screen.getByText('Close QR')
        fireEvent.click(closeButton)

        expect(screen.queryByTestId('qr-modal')).not.toBeInTheDocument()
    })

    it('should alternate colors based on index', () => {
        const { container: container0 } = render(<TagCard tag={mockTag} index={0} />)
        // Check for golden shadow class if index is even
        // We can check class list on the wrapper div
        // The structure is <> <div class="relative group ..."> 
        // We need to target that div. Link is inside.
        // Let's inspect the first child of the fragment.
        // RTL render returns container which is a div wrapper.
        // container.firstChild should be our element.
        expect(container0.firstChild).toHaveClass('shadow-golden')

        const { container: container1 } = render(<TagCard tag={mockTag} index={1} />)
        expect(container1.firstChild).toHaveClass('shadow-blue')
    })
})
