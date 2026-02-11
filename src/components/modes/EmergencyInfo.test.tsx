import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EmergencyInfoMode from './EmergencyInfo'
import type { EmergencyInfo } from '@/lib/types/database'

describe('EmergencyInfoMode', () => {
    const mockData: EmergencyInfo = {
        id: '1',
        tag_id: 'tag-1',
        blood_type: 'O+',
        allergies: ['Peanuts', 'Penicillin'],
        medications: ['Ibuprofen'],
        conditions: ['Asthma'],
        emergency_contacts: [
            { name: 'Mom', phone: '555-0101', relationship: 'Mother' },
            { name: 'Dad', phone: '555-0102', relationship: 'Father' },
        ],
        doctor_name: 'Dr. Smith',
        doctor_phone: '555-0200',
        notes: 'Carry inhaler',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    }

    it('should render header with 911 call button', () => {
        render(<EmergencyInfoMode data={mockData} />)

        expect(screen.getByText('Medical ID')).toBeInTheDocument()
        const call911 = screen.getByText('Call 911').closest('a')
        expect(call911).toHaveAttribute('href', 'tel:911')
    })

    it('should render blood type', () => {
        render(<EmergencyInfoMode data={mockData} />)
        expect(screen.getByText('O+')).toBeInTheDocument()
    })

    it('should render lists correctly', () => {
        render(<EmergencyInfoMode data={mockData} />)

        expect(screen.getByText('Peanuts')).toBeInTheDocument()
        expect(screen.getByText('Penicillin')).toBeInTheDocument()
        expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
        expect(screen.getByText('Asthma')).toBeInTheDocument()
        expect(screen.getByText('Carry inhaler')).toBeInTheDocument()
    })

    it('should render emergency contacts with call links', () => {
        render(<EmergencyInfoMode data={mockData} />)

        expect(screen.getByText('Mom')).toBeInTheDocument()
        expect(screen.getByText('Mother')).toBeInTheDocument()

        const momCall = screen.getByText('Mom').closest('a')
        expect(momCall).toHaveAttribute('href', 'tel:555-0101')

        expect(screen.getByText('Dad')).toBeInTheDocument()
    })

    it('should render doctor info', () => {
        render(<EmergencyInfoMode data={mockData} />)

        expect(screen.getByText('Dr. Smith')).toBeInTheDocument()

        const docCall = screen.getByText('Dr. Smith').closest('a')
        expect(docCall).toHaveAttribute('href', 'tel:555-0200')
    })

    it('should handle minimal data', () => {
        const minimalData: EmergencyInfo = {
            id: '2',
            tag_id: 'tag-2',
            blood_type: null,
            allergies: null,
            medications: null,
            conditions: null,
            emergency_contacts: null,
            doctor_name: null,
            doctor_phone: null,
            notes: null,
            created_at: '',
            updated_at: '',
        }

        render(<EmergencyInfoMode data={minimalData} />)

        expect(screen.getByText('Medical ID')).toBeInTheDocument()
        // Should not render sections
        expect(screen.queryByText('Blood Type')).not.toBeInTheDocument()
        expect(screen.queryByText('Allergies')).not.toBeInTheDocument()
        expect(screen.queryByText('Medications')).not.toBeInTheDocument()
    })
})
