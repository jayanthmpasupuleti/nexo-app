'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CustomRedirect } from '@/lib/types/database'
import { LuSave, LuCheck } from 'react-icons/lu'

interface RedirectEditorProps {
    tagId: string
    data?: CustomRedirect | null
}

export default function RedirectEditor({ tagId, data }: RedirectEditorProps) {
    const [url, setUrl] = useState(data?.url || '')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
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
        setSaved(true)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-black/60 text-sm mb-2">
                    Redirect URL <span className="text-red-500">*</span>
                </label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setSaved(false) }}
                    required
                    className="input-sketchy w-full"
                    placeholder="https://example.com"
                />
                <p className="text-black/40 text-xs mt-1">
                    Users who tap your NFC tag will be redirected to this URL
                </p>
            </div>

            <button
                onClick={handleSave}
                disabled={saving || !url}
                className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {saving ? (
                    <span>Saving...</span>
                ) : saved ? (
                    <><LuCheck className="text-lg" /><span>Saved</span></>
                ) : (
                    <><LuSave className="text-lg" /><span>Save Redirect</span></>
                )}
            </button>
        </div>
    )
}
