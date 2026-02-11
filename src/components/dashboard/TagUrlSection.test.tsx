import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import TagUrlSection from './TagUrlSection'

// Mock QRCodeDisplay
vi.mock('@/components/common/QRCodeDisplay', () => ({
    default: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="qr-modal">
            <button onClick={onClose}>Close QR</button>
        </div>
    ),
}))

describe('TagUrlSection', () => {
    const testUrl = 'https://nexo.app/t/TESTTAG'
    const testCode = 'TESTTAG'

    // Mock clipboard API
    const mockWriteText = vi.fn()
    Object.assign(navigator, {
        clipboard: {
            writeText: mockWriteText,
        },
    })

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render tag URL', () => {
        render(<TagUrlSection tagUrl={testUrl} tagCode={testCode} />)
        expect(screen.getByText(testUrl)).toBeInTheDocument()
    })

    it('should copy to clipboard when clicking copy button', async () => {
        render(<TagUrlSection tagUrl={testUrl} tagCode={testCode} />)

        const copyButton = screen.getByText('Copy')
        fireEvent.click(copyButton)

        expect(mockWriteText).toHaveBeenCalledWith(testUrl)

        // Should show "Copied" temporarily
        expect(await screen.findByText('Copied')).toBeInTheDocument()
    })

    it('should open QR modal when clicking Show QR', () => {
        render(<TagUrlSection tagUrl={testUrl} tagCode={testCode} />)

        const qrButton = screen.getByText('Show QR')
        fireEvent.click(qrButton)

        expect(screen.getByTestId('qr-modal')).toBeInTheDocument()
    })

    it('should close QR modal when onClose is triggered', () => {
        render(<TagUrlSection tagUrl={testUrl} tagCode={testCode} />)

        fireEvent.click(screen.getByText('Show QR'))
        expect(screen.getByTestId('qr-modal')).toBeInTheDocument()

        fireEvent.click(screen.getByText('Close QR'))
        expect(screen.queryByTestId('qr-modal')).not.toBeInTheDocument()
    })

    it('should have a working Open link', () => {
        render(<TagUrlSection tagUrl={testUrl} tagCode={testCode} />)

        const openLink = screen.getByRole('link', { name: /open/i })
        expect(openLink).toHaveAttribute('href', testUrl)
        expect(openLink).toHaveAttribute('target', '_blank')
    })
})
