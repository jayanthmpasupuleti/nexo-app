import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import LoginPage from './page'

// Mock useRouter
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
}))

// Mock Supabase
const mockSignIn = vi.fn()
vi.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        auth: {
            signInWithPassword: mockSignIn,
        },
    }),
}))

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render login form correctly', () => {
        render(<LoginPage />)

        expect(screen.getByRole('heading', { name: /Nexo/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
        expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument()
    })

    it('should handle successful login', async () => {
        mockSignIn.mockResolvedValue({ error: null })

        render(<LoginPage />)

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
        })

        expect(mockPush).toHaveBeenCalledWith('/dashboard')
        expect(mockRefresh).toHaveBeenCalled()
    })

    it('should handle login error', async () => {
        mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } })

        render(<LoginPage />)

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } })

        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('should show loading state', async () => {
        // Delay resolution to check loading state
        mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)))

        render(<LoginPage />)

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } })

        const button = screen.getByRole('button', { name: /Sign In/i })
        fireEvent.click(button)

        expect(screen.getByText('Signing in...')).toBeInTheDocument()
        expect(button).toBeDisabled()

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalled()
        })
    })
})
