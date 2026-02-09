'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { WifiConfig, WifiSecurity } from '@/lib/types/database'
import { LuSave, LuCheck } from 'react-icons/lu'

interface WiFiEditorProps {
    tagId: string
    data?: WifiConfig | null
}

export default function WiFiEditor({ tagId, data }: WiFiEditorProps) {
    const [formData, setFormData] = useState({
        ssid: data?.ssid || '',
        password: data?.password || '',
        security: data?.security || 'WPA2' as WifiSecurity,
        hidden: data?.hidden || false,
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
        setSaved(false)
    }

    const handleSave = async () => {
        setSaving(true)

        if (data) {
            await (supabase.from('wifi_configs') as any)
                .update(formData)
                .eq('id', data.id)
        } else {
            await (supabase.from('wifi_configs') as any)
                .insert({ ...formData, tag_id: tagId })
        }

        setSaving(false)
        setSaved(true)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-black/60 text-sm mb-2">
                    Network Name (SSID) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="ssid"
                    value={formData.ssid}
                    onChange={handleChange}
                    required
                    className="input-sketchy w-full"
                    placeholder="My WiFi Network"
                />
            </div>

            <div>
                <label className="block text-black/60 text-sm mb-2">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-sketchy w-full"
                />
                <p className="text-black/40 text-xs mt-1">This will be visible to anyone who scans your tag</p>
            </div>

            <div>
                <label className="block text-black/60 text-sm mb-2">Security Type</label>
                <select
                    name="security"
                    value={formData.security}
                    onChange={handleChange}
                    className="input-sketchy w-full"
                >
                    <option value="WPA">WPA</option>
                    <option value="WPA2">WPA2</option>
                    <option value="WPA3">WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                </select>
            </div>

            <div className="flex items-center gap-3 py-2">
                <input
                    type="checkbox"
                    id="hidden"
                    name="hidden"
                    checked={formData.hidden}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-2 border-black accent-[var(--golden)]"
                />
                <label htmlFor="hidden" className="text-black/60 text-sm">
                    Hidden network
                </label>
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
                    <><LuSave className="text-lg" /><span>Save Wi-Fi Settings</span></>
                )}
            </button>
        </div>
    )
}
