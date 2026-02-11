import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import EmergencyEditor from './EmergencyEditor'
import type { EmergencyInfo } from '@/lib/types/database'

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

describe('EmergencyEditor', () => {
    const mockData: EmergencyInfo = {
        id: '101',
        tag_id: 'tag-1',
        blood_type: 'O+',
        allergies: ['Peanuts'],
        medications: ['Ibuprofen'],
        conditions: ['Asthma'],
        doctor_name: 'Dr. House',
        doctor_phone: '555-1234',
        emergency_contacts: [
            { name: 'Mom', phone: '555-0000', relationship: 'Mother' }
        ],
        notes: 'Take care',
        created_at: '',
        updated_at: '',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUpdate.mockReturnValue({ eq: mockEq })
        mockInsert.mockResolvedValue({ error: null })
    })

    it('should render form with existing data', () => {
        const { container } = render(<EmergencyEditor tagId="tag-1" data={mockData} />)

        expect(screen.getByDisplayValue('O+')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Peanuts')).toBeInTheDocument()
        expect(container.querySelector('input[value="Dr. House"]')).toBeInTheDocument()
        expect(container.querySelector('input[value="Mom"]')).toBeInTheDocument()
    })

    it('should update array fields (allergies)', () => {
        render(<EmergencyEditor tagId="tag-1" data={null} />)

        const allergyInput = screen.getByPlaceholderText(/Peanuts/i)
        fireEvent.change(allergyInput, { target: { value: 'Dust, Pollen' } })
        expect(allergyInput).toHaveValue('Dust, Pollen')
    })

    it('should manage emergency contacts', () => {
        render(<EmergencyEditor tagId="tag-1" data={null} />)

        fireEvent.click(screen.getByText('Add Contact'))

        const nameInput = screen.getByPlaceholderText('Name')
        fireEvent.change(nameInput, { target: { value: 'Dad' } })

        const phoneInput = screen.getByPlaceholderText('Phone')
        fireEvent.change(phoneInput, { target: { value: '555-9999' } })

        expect(nameInput).toHaveValue('Dad')
    })

    it('should save existing emergency info (update)', async () => {
        const { container } = render(<EmergencyEditor tagId="tag-1" data={mockData} />)

        // Find doctor name input. It lacks placeholder.
        // It follows "Doctor Name" label.
        // We can find by value since it's populated.
        const nameInput = container.querySelector('input[value="Dr. House"]')!
        fireEvent.change(nameInput, { target: { value: 'Dr. Wilson' } })

        fireEvent.click(screen.getByText('Save Emergency Info'))

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                doctor_name: 'Dr. Wilson'
            }))
        })
        expect(mockEq).toHaveBeenCalledWith('id', '101')
        expect(mockRefresh).toHaveBeenCalled()
    })

    it('should create new emergency info (insert)', async () => {
        render(<EmergencyEditor tagId="tag-1" data={null} />)

        const allergyInput = screen.getByPlaceholderText(/Peanuts/i)
        fireEvent.change(allergyInput, { target: { value: 'Cats' } })

        fireEvent.click(screen.getByText('Save Emergency Info'))

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                tag_id: 'tag-1',
                allergies: ['Cats'],
            }))
        })
        expect(mockRefresh).toHaveBeenCalled()
    })
})
