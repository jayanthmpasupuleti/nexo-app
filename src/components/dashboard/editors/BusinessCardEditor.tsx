'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { BusinessCard } from '@/lib/types/database'
import AvatarUpload from '../AvatarUpload'
import { LuSave, LuCheck } from 'react-icons/lu'

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
        avatar_url: data?.avatar_url || null as string | null,
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setSaved(false)
    }

    const handleAvatarChange = (url: string | null) => {
        setFormData(prev => ({ ...prev, avatar_url: url }))
        setSaved(false)
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
        setSaved(true)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            {/* Avatar Upload */}
            <AvatarUpload
                currentAvatarUrl={formData.avatar_url}
                tagId={tagId}
                businessCardId={data?.id || null}
                name={formData.name}
                onAvatarChange={handleAvatarChange}
            />

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
                <label className="block text-black/60 text-sm mb-2">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="input-sketchy w-full resize-none"
                    placeholder="A brief description about yourself..."
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
                    <><LuSave className="text-lg" /><span>Save Business Card</span></>
                )}
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
            <label className="block text-black/60 text-sm mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="input-sketchy w-full"
            />
        </div>
    )
}
