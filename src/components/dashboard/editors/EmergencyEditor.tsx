'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { EmergencyInfo } from '@/lib/types/database'
import { LuSave, LuCheck, LuPlus, LuX } from 'react-icons/lu'

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
    const [saved, setSaved] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleArrayField = (field: 'allergies' | 'medications' | 'conditions', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.split(',').map(s => s.trim()).filter(Boolean),
        }))
        setSaved(false)
    }

    const addContact = () => {
        setContacts([...contacts, { name: '', phone: '', relationship: '' }])
        setSaved(false)
    }

    const updateContact = (index: number, field: keyof Contact, value: string) => {
        const newContacts = [...contacts]
        newContacts[index] = { ...newContacts[index], [field]: value }
        setContacts(newContacts)
        setSaved(false)
    }

    const removeContact = (index: number) => {
        setContacts(contacts.filter((_, i) => i !== index))
        setSaved(false)
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
        setSaved(true)
        router.refresh()
    }

    return (
        <div className="space-y-5">
            {/* Blood Type */}
            <div>
                <label className="block text-black/60 text-sm mb-2">Blood Type</label>
                <select
                    value={formData.blood_type}
                    onChange={(e) => { setFormData(prev => ({ ...prev, blood_type: e.target.value })); setSaved(false) }}
                    className="input-sketchy w-full"
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
                <label className="block text-black/60 text-sm mb-2">Allergies</label>
                <input
                    type="text"
                    value={formData.allergies.join(', ')}
                    onChange={(e) => handleArrayField('allergies', e.target.value)}
                    className="input-sketchy w-full"
                    placeholder="Penicillin, Peanuts, Shellfish (comma-separated)"
                />
            </div>

            {/* Medications */}
            <div>
                <label className="block text-black/60 text-sm mb-2">Current Medications</label>
                <input
                    type="text"
                    value={formData.medications.join(', ')}
                    onChange={(e) => handleArrayField('medications', e.target.value)}
                    className="input-sketchy w-full"
                    placeholder="Medication names (comma-separated)"
                />
            </div>

            {/* Conditions */}
            <div>
                <label className="block text-black/60 text-sm mb-2">Medical Conditions</label>
                <input
                    type="text"
                    value={formData.conditions.join(', ')}
                    onChange={(e) => handleArrayField('conditions', e.target.value)}
                    className="input-sketchy w-full"
                    placeholder="Diabetes, Asthma, etc. (comma-separated)"
                />
            </div>

            {/* Doctor */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-black/60 text-sm mb-2">Doctor Name</label>
                    <input
                        type="text"
                        value={formData.doctor_name}
                        onChange={(e) => { setFormData(prev => ({ ...prev, doctor_name: e.target.value })); setSaved(false) }}
                        className="input-sketchy w-full"
                    />
                </div>
                <div>
                    <label className="block text-black/60 text-sm mb-2">Doctor Phone</label>
                    <input
                        type="tel"
                        value={formData.doctor_phone}
                        onChange={(e) => { setFormData(prev => ({ ...prev, doctor_phone: e.target.value })); setSaved(false) }}
                        className="input-sketchy w-full"
                    />
                </div>
            </div>

            {/* Emergency Contacts */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-black/60 text-sm">Emergency Contacts</label>
                    <button
                        type="button"
                        onClick={addContact}
                        className="px-3 py-1.5 bg-[var(--golden)] text-black rounded-lg text-sm font-bold border-2 border-black hover:bg-[var(--golden-light)] transition-colors inline-flex items-center gap-1"
                        style={{ boxShadow: '2px 2px 0 #000' }}
                    >
                        <LuPlus /> Add Contact
                    </button>
                </div>
                <div className="space-y-3">
                    {contacts.map((contact, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border-2 border-black space-y-2" style={{ boxShadow: '2px 2px 0 #000' }}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={contact.name}
                                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                                    className="input-sketchy flex-1 text-sm"
                                    placeholder="Name"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeContact(index)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LuX className="text-lg" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                                    className="input-sketchy text-sm"
                                    placeholder="Phone"
                                />
                                <input
                                    type="text"
                                    value={contact.relationship}
                                    onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                                    className="input-sketchy text-sm"
                                    placeholder="Relationship"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-black/60 text-sm mb-2">Additional Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => { setFormData(prev => ({ ...prev, notes: e.target.value })); setSaved(false) }}
                    rows={3}
                    className="input-sketchy w-full resize-none"
                    placeholder="Any other important medical information..."
                />
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {saving ? (
                    <span>Saving...</span>
                ) : saved ? (
                    <><LuCheck className="text-lg" /><span>Saved</span></>
                ) : (
                    <><LuSave className="text-lg" /><span>Save Emergency Info</span></>
                )}
            </button>
        </div>
    )
}
