'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CustomRedirect } from '@/lib/types/database'

interface RedirectEditorProps {
    tagId: string
    data?: CustomRedirect | null
}

export default function RedirectEditor({ tagId, data }: RedirectEditorProps) {
    const [url, setUrl] = useState(data?.url || '')
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSave = async () => {
        setSaving(true)

        if (data) {
            await (supabase.from('custom_redirects') as any)
                .update({ url })
                .eq('id', data.id)
        } else {
            await (supabase.from('custom_redirects') as any)
                .insert({ url, tag_id: tagId })
        }

        setSaving(false)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Redirect URL <span className="text-red-500">*</span>
                </label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                />
                <p className="text-gray-500 text-xs mt-1">
                    Users who tap your NFC tag will be redirected to this URL
                </p>
            </div>

            <button
                onClick={handleSave}
                disabled={saving || !url}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Redirect'}
            </button>
        </div>
    )
}
