import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LinkHubMode from './LinkHub'
import type { LinkHub } from '@/lib/types/database'

describe('LinkHubMode', () => {
    const mockData: LinkHub = {
        id: '1',
        tag_id: 'tag-1',
        title: 'My Links',
        bio: 'Check out my stuff',
        avatar_url: null,
        links: [
            { title: 'Portfolio', url: 'https://portfolio.com', icon: 'briefcase' },
            { title: 'Twitter', url: 'https://twitter.com/me', icon: 'twitter' },
        ],
        theme: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    }

    it('should render title and bio', () => {
        render(<LinkHubMode data={mockData} />)

        expect(screen.getByText('My Links')).toBeInTheDocument()
        expect(screen.getByText('Check out my stuff')).toBeInTheDocument()
    })

    it('should render all links correctly', () => {
        render(<LinkHubMode data={mockData} />)

        const portfolioLink = screen.getByText('Portfolio').closest('a')
        expect(portfolioLink).toHaveAttribute('href', 'https://portfolio.com')
        expect(portfolioLink).toHaveAttribute('target', '_blank')
        expect(portfolioLink).toHaveAttribute('rel', 'noopener noreferrer')

        const twitterLink = screen.getByText('Twitter').closest('a')
        expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/me')
    })

    it('should handle empty links list', () => {
        const emptyData = { ...mockData, links: [] }
        render(<LinkHubMode data={emptyData} />)

        expect(screen.getByText('No links added yet')).toBeInTheDocument()
    })

    it('should render fallback avatar when no image provided', () => {
        render(<LinkHubMode data={mockData} />)
        // Should show first letter of title
        expect(screen.getByText('M')).toBeInTheDocument()
    })
})
