import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import WiFiShare from './WiFiShare'
import type { WifiConfig } from '@/lib/types/database'

// Mock getWifiQRUrl
vi.mock('@/lib/utils/wifi-qr', () => ({
    getWifiQRUrl: () => 'mock-qr-url',
}))

describe('WiFiShare', () => {
    const mockData: WifiConfig = {
        id: '1',
        tag_id: 'tag-1',
        ssid: 'MyNetwork',
        password: 'securepassword',
        security: 'WPA2',
        hidden: false,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    }

    // Mock clipboard
    const mockWriteText = vi.fn()
    Object.assign(navigator, {
        clipboard: {
            writeText: mockWriteText,
        },
    })

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render network details', () => {
        render(<WiFiShare data={mockData} />)

        expect(screen.getAllByText('MyNetwork')).toHaveLength(2) // Header and Details
        expect(screen.getByText('WPA2')).toBeInTheDocument()
        expect(screen.getByText('Scan to connect')).toBeInTheDocument()
    })

    it('should render QR code with correct source', () => {
        render(<WiFiShare data={mockData} />)
        const img = screen.getByAltText('WiFi QR code for MyNetwork')
        expect(img).toHaveAttribute('src', 'mock-qr-url')
    })

    it('should toggle password visibility', () => {
        render(<WiFiShare data={mockData} />)

        // Initially hidden
        expect(screen.getByText('••••••••')).toBeInTheDocument()
        expect(screen.queryByText('securepassword')).not.toBeInTheDocument()

        // Click toggle
        const toggleButton = screen.getByRole('button', { name: '' }) // The eye icon button. It has no text, so might be hard to select by name.
        // It renders <LuEye /> or <LuEyeOff />.
        // Let's select by the button that wraps it. It's the only button in that container or we can use container query.
        // Or better, add aria-label to the button in the component for better a11y and testing.
        // For now, let's try finding by the mocked icon or class?
        // Actually, the button has `onClick` and `className`.
        // Let's use `container` to query.

        // Strategy: find the password container properties
        const passwordLabel = screen.getByText('Password')
        const row = passwordLabel.closest('div.flex')!
        const button = row.querySelector('button')!

        fireEvent.click(button)
        expect(screen.getByText('securepassword')).toBeInTheDocument()

        fireEvent.click(button)
        expect(screen.getByText('••••••••')).toBeInTheDocument()
    })

    it('should copy password to clipboard', async () => {
        render(<WiFiShare data={mockData} />)

        const copyButton = screen.getByText('Copy Password')
        fireEvent.click(copyButton)

        expect(mockWriteText).toHaveBeenCalledWith('securepassword')
        expect(await screen.findByText('Copied!')).toBeInTheDocument()
    })

    it('should handle missing password (open network)', () => {
        const openData = { ...mockData, password: '', security: 'nopass' as const }
        render(<WiFiShare data={openData} />)

        // Should not crash, just display empty/hidden password or similar
        expect(screen.getByText('••••••••')).toBeInTheDocument()
    })
})
