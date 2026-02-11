import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'

describe('HomePage', () => {
    it('should render the hero section correctly', () => {
        render(<HomePage />)

        expect(screen.getByText(/Share your digital identity/i)).toBeInTheDocument()
        expect(screen.getByText(/with a single tap/i)).toBeInTheDocument()
        expect(screen.getByText(/Transform any NFC tag/i)).toBeInTheDocument()
    })

    it('should have working navigation links', () => {
        render(<HomePage />)

        const loginLinks = screen.getAllByText(/Log in/i)
        expect(loginLinks[0].closest('a')).toHaveAttribute('href', '/login')

        const signupLinks = screen.getAllByRole('link', { name: /Get started/i })
        // One in nav, one in CTA? Actually "Get started" is in nav. "Start for free" is in hero.
        expect(signupLinks[0]).toHaveAttribute('href', '/signup')

        const startFreeLink = screen.getByRole('link', { name: /Start for free/i })
        expect(startFreeLink).toHaveAttribute('href', '/signup')
    })

    it('should render all feature cards', () => {
        render(<HomePage />)

        expect(screen.getByText('Business Card')).toBeInTheDocument()
        expect(screen.getByText('Wi-Fi Sharing')).toBeInTheDocument()
        expect(screen.getByText('Link Hub')).toBeInTheDocument()
        expect(screen.getByText('Emergency Info')).toBeInTheDocument()
        expect(screen.getByText('Redirect')).toBeInTheDocument()
        expect(screen.getByText('Switch Modes')).toBeInTheDocument()
    })

    it('should render how it works steps', () => {
        render(<HomePage />)

        expect(screen.getByText('Get a tag')).toBeInTheDocument()
        expect(screen.getByText('Configure')).toBeInTheDocument()
        expect(screen.getByText('Share')).toBeInTheDocument()
    })

    it('should render footer with current year', () => {
        render(<HomePage />)

        const year = new Date().getFullYear().toString()
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    })
})
