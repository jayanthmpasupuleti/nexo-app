import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import SignupPage from './page'

// Mock Supabase
const mockSignUp = vi.fn()
vi.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        auth: {
            signUp: mockSignUp,
        },
    }),
}))

describe('SignupPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render signup form correctly', () => {
        render(<SignupPage />)

        expect(screen.getByRole('heading', { name: /Nexo/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
        expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument()
    })

    it('should handle successful signup', async () => {
        mockSignUp.mockResolvedValue({ error: null })

        render(<SignupPage />)

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith({
                email: 'john@example.com',
                password: 'password123',
                options: {
                    data: {
                        full_name: 'John Doe',
                    },
                },
            })
        })

        // Should show success message
        expect(await screen.findByText('Check your email')).toBeInTheDocument()
        expect(screen.getByText(/sent a confirmation link/i)).toBeInTheDocument()
    })

    it('should handle signup error', async () => {
        mockSignUp.mockResolvedValue({ error: { message: 'Email already registered' } })

        render(<SignupPage />)

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

        expect(await screen.findByText('Email already registered')).toBeInTheDocument()
        // Should NOT show success
        expect(screen.queryByText('Check your email')).not.toBeInTheDocument()
    })

    it('should show loading state', async () => {
        mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)))

        render(<SignupPage />)

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@test.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } })

        const button = screen.getByRole('button', { name: /Create Account/i })
        fireEvent.click(button)

        expect(screen.getByText('Creating account...')).toBeInTheDocument()
        expect(button).toBeDisabled()

        await waitFor(() => {
            expect(screen.getByText('Check your email')).toBeInTheDocument()
        })
    })
})
