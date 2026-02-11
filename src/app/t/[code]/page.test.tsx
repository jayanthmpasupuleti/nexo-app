import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TagPage from './page'
import * as navigation from 'next/navigation'

// Mock Supabase
const { mockSelect, mockFrom, mockInsert, mockUpdate } = vi.hoisted(() => {
    const mockSelect = vi.fn()
    const mockInsert = vi.fn().mockResolvedValue({})
    const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({})
    })
    const mockFrom = vi.fn(() => ({
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
    }))
    return { mockSelect, mockFrom, mockInsert, mockUpdate }
})

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => Promise.resolve({
        from: mockFrom,
    })),
}))

// Mock Navigation
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
    redirect: vi.fn(() => { throw new Error('NEXT_REDIRECT') }),
}))

// Mock Mode Components
vi.mock('@/components/modes/BusinessCard', () => ({ default: () => <div data-testid="mode-biz">Business Card</div> }))
vi.mock('@/components/modes/WiFiShare', () => ({ default: () => <div data-testid="mode-wifi">WiFi Share</div> }))
vi.mock('@/components/modes/LinkHub', () => ({ default: () => <div data-testid="mode-link">Link Hub</div> }))
vi.mock('@/components/modes/EmergencyInfo', () => ({ default: () => <div data-testid="mode-emergency">Emergency Info</div> }))

describe('TagPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockParams = Promise.resolve({ code: 'ABC12345' })

    it('should call notFound if tag is not found', async () => {
        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: null, error: 'Not found' }),
                }),
            }),
        })

        try {
            await TagPage({ params: mockParams })
        } catch (e: any) {
            expect(e.message).toBe('NEXT_NOT_FOUND')
        }
        expect(navigation.notFound).toHaveBeenCalled()
    })

    it('should render BusinessCard mode', async () => {
        const mockTag = {
            id: '1',
            code: 'ABC12345',
            active_mode: 'business_card',
            tap_count: 0,
            business_cards: { name: 'John Doe' },
            // other fields mocked as needed or ignored by mocked query
        }

        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: mockTag, error: null }),
                }),
            }),
        })

        const jsx = await TagPage({ params: mockParams })
        render(jsx)

        expect(screen.getByTestId('mode-biz')).toBeInTheDocument()
    })

    it('should redirect for Redirect mode', async () => {
        const mockTag = {
            id: '1',
            code: 'ABC12345',
            active_mode: 'redirect',
            tap_count: 0,
            custom_redirects: { url: 'https://google.com' },
        }

        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: mockTag, error: null }),
                }),
            }),
        })

        try {
            await TagPage({ params: mockParams })
        } catch (e: any) {
            expect(e.message).toBe('NEXT_REDIRECT')
        }
        expect(navigation.redirect).toHaveBeenCalledWith('https://google.com')
    })

    it('should increment tap count', async () => {
        const mockTag = {
            id: 'tag-1',
            code: 'ABC12345',
            active_mode: 'business_card',
            tap_count: 10,
            business_cards: { name: 'John Doe' },
        }

        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: mockTag, error: null }),
                }),
            }),
        })

        const jsx = await TagPage({ params: mockParams })
        render(jsx)

        // The async IIFE might take a tick
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(mockInsert).toHaveBeenCalled() // tap_events
        expect(mockUpdate).toHaveBeenCalledWith({ tap_count: 11 }) // tap count
    })
})
