'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { BusinessCard } from '@/lib/types/database'

interface BusinessCardEditorProps {
    tagId: string
    data?: BusinessCard | null
}

export default function BusinessCardEditor({ tagId, data }: BusinessCardEditorProps) {
    const [formData, setFormData] = useState({
        name: data?.name || '',
        title: data?.title || '',
        company: data?.company || '',
        email: data?.email || '',
        phone: data?.phone || '',
        website: data?.website || '',
        linkedin: data?.linkedin || '',
        bio: data?.bio || '',
    })
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async () => {
        setSaving(true)

        if (data) {
            await (supabase.from('business_cards') as any)
                .update(formData)
                .eq('id', data.id)
        } else {
            await (supabase.from('business_cards') as any)
                .insert({ ...formData, tag_id: tagId })
        }

        setSaving(false)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} />
                <InputField label="Company" name="company" value={formData.company} onChange={handleChange} />
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <InputField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                <InputField label="Website" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://" />
                <InputField label="LinkedIn" name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="A brief description about yourself..."
                />
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Business Card'}
            </button>
        </div>
    )
}

function InputField({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    required?: boolean
    placeholder?: string
}) {
    return (
        <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>
    )
}
