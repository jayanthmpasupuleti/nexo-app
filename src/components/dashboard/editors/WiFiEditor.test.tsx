import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import WiFiEditor from './WiFiEditor'
import type { WifiConfig } from '@/lib/types/database'

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

describe('WiFiEditor', () => {
    const mockData: WifiConfig = {
        id: '456',
        tag_id: 'tag-1',
        ssid: 'MyWiFi',
        password: 'securepass',
        security: 'WPA2',
        hidden: false,
        created_at: '',
        updated_at: '',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUpdate.mockReturnValue({ eq: mockEq })
        mockInsert.mockResolvedValue({ error: null })
    })

    it('should render form with existing data', () => {
        const { container } = render(<WiFiEditor tagId="tag-1" data={mockData} />)

        expect(screen.getByDisplayValue('MyWiFi')).toBeInTheDocument()
        expect(screen.getByDisplayValue('securepass')).toBeInTheDocument()
        expect(container.querySelector('select[name="security"]')).toHaveValue('WPA2')
        expect(container.querySelector('input[name="hidden"]')).not.toBeChecked()
    })

    it('should render empty form when no data provided', () => {
        const { container } = render(<WiFiEditor tagId="tag-1" data={null} />)

        expect(screen.getByPlaceholderText('My WiFi Network')).toHaveValue('')
        expect(container.querySelector('input[name="password"]')).toHaveValue('')
        expect(container.querySelector('select[name="security"]')).toHaveValue('WPA2')
    })

    it('should update form fields', () => {
        const { container } = render(<WiFiEditor tagId="tag-1" data={null} />)

        const ssidInput = screen.getByPlaceholderText('My WiFi Network')
        fireEvent.change(ssidInput, { target: { value: 'Guest WiFi' } })
        expect(ssidInput).toHaveValue('Guest WiFi')

        const hiddenInput = container.querySelector('input[name="hidden"]')!
        fireEvent.click(hiddenInput)
        expect(hiddenInput).toBeChecked()
    })

    it('should save existing wifi config (update)', async () => {
        render(<WiFiEditor tagId="tag-1" data={mockData} />)

        const ssidInput = screen.getByPlaceholderText('My WiFi Network')
        fireEvent.change(ssidInput, { target: { value: 'Updated WiFi' } })

        fireEvent.click(screen.getByText('Save Wi-Fi Settings'))

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                ssid: 'Updated WiFi',
                password: 'securepass',
            }))
        })
        expect(mockEq).toHaveBeenCalledWith('id', '456')
        expect(mockRefresh).toHaveBeenCalled()
    })

    it('should create new wifi config (insert)', async () => {
        const { container } = render(<WiFiEditor tagId="tag-1" data={null} />)

        const ssidInput = screen.getByPlaceholderText('My WiFi Network')
        fireEvent.change(ssidInput, { target: { value: 'New WiFi' } })

        const passwordInput = container.querySelector('input[name="password"]')!
        fireEvent.change(passwordInput, { target: { value: 'pass123' } })

        fireEvent.click(screen.getByText('Save Wi-Fi Settings'))

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                tag_id: 'tag-1',
                ssid: 'New WiFi',
                password: 'pass123',
                security: 'WPA2',
            }))
        })
        expect(mockRefresh).toHaveBeenCalled()
    })
})
