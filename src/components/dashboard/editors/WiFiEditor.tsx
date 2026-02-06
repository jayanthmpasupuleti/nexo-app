'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { WifiConfig, WifiSecurity } from '@/lib/types/database'

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
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
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
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Network Name (SSID) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="ssid"
                    value={formData.ssid}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-gray-500 text-xs mt-1">This will be visible to anyone who scans your tag</p>
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Security Type</label>
                <select
                    name="security"
                    value={formData.security}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="WPA">WPA</option>
                    <option value="WPA2">WPA2</option>
                    <option value="WPA3">WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                </select>
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="hidden"
                    name="hidden"
                    checked={formData.hidden}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="hidden" className="text-gray-700">
                    Hidden network
                </label>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Wi-Fi Settings'}
            </button>
        </div>
    )
}
