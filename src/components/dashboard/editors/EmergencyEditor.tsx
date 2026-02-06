'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { EmergencyInfo } from '@/lib/types/database'

interface EmergencyEditorProps {
    tagId: string
    data?: EmergencyInfo | null
}

interface Contact {
    name: string
    phone: string
    relationship: string
}

export default function EmergencyEditor({ tagId, data }: EmergencyEditorProps) {
    const [formData, setFormData] = useState({
        blood_type: data?.blood_type || '',
        allergies: data?.allergies || [],
        medications: data?.medications || [],
        conditions: data?.conditions || [],
        doctor_name: data?.doctor_name || '',
        doctor_phone: data?.doctor_phone || '',
        notes: data?.notes || '',
    })
    const [contacts, setContacts] = useState<Contact[]>(
        (data?.emergency_contacts as Contact[]) || []
    )
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleArrayField = (field: 'allergies' | 'medications' | 'conditions', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.split(',').map(s => s.trim()).filter(Boolean),
        }))
    }

    const addContact = () => {
        setContacts([...contacts, { name: '', phone: '', relationship: '' }])
    }

    const updateContact = (index: number, field: keyof Contact, value: string) => {
        const newContacts = [...contacts]
        newContacts[index] = { ...newContacts[index], [field]: value }
        setContacts(newContacts)
    }

    const removeContact = (index: number) => {
        setContacts(contacts.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        setSaving(true)

        const payload = { ...formData, emergency_contacts: contacts }

        if (data) {
            await (supabase.from('emergency_infos') as any)
                .update(payload)
                .eq('id', data.id)
        } else {
            await (supabase.from('emergency_infos') as any)
                .insert({ ...payload, tag_id: tagId })
        }

        setSaving(false)
        router.refresh()
    }

    return (
        <div className="space-y-6">
            {/* Blood Type */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Blood Type</label>
                <select
                    value={formData.blood_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, blood_type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
            </div>

            {/* Allergies */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Allergies</label>
                <input
                    type="text"
                    value={formData.allergies.join(', ')}
                    onChange={(e) => handleArrayField('allergies', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder="Penicillin, Peanuts, Shellfish (comma-separated)"
                />
            </div>

            {/* Medications */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Current Medications</label>
                <input
                    type="text"
                    value={formData.medications.join(', ')}
                    onChange={(e) => handleArrayField('medications', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder="Medication names (comma-separated)"
                />
            </div>

            {/* Conditions */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Medical Conditions</label>
                <input
                    type="text"
                    value={formData.conditions.join(', ')}
                    onChange={(e) => handleArrayField('conditions', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder="Diabetes, Asthma, etc. (comma-separated)"
                />
            </div>

            {/* Doctor */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Doctor Name</label>
                    <input
                        type="text"
                        value={formData.doctor_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Doctor Phone</label>
                    <input
                        type="tel"
                        value={formData.doctor_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, doctor_phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    />
                </div>
            </div>

            {/* Emergency Contacts */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-gray-700 text-sm font-medium">Emergency Contacts</label>
                    <button type="button" onClick={addContact} className="text-purple-600 text-sm font-medium">
                        + Add Contact
                    </button>
                </div>
                <div className="space-y-3">
                    {contacts.map((contact, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={contact.name}
                                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Name"
                                />
                                <button type="button" onClick={() => removeContact(index)} className="text-red-500 px-2">✕</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Phone"
                                />
                                <input
                                    type="text"
                                    value={contact.relationship}
                                    onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Relationship"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder="Any other important medical information..."
                />
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Emergency Info'}
            </button>
        </div>
    )
}
