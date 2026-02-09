'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { LinkHub } from '@/lib/types/database'
import { LuSave, LuCheck, LuPlus, LuX } from 'react-icons/lu'

interface LinkHubEditorProps {
    tagId: string
    data?: LinkHub | null
}

interface Link {
    title: string
    url: string
    icon: string
}

export default function LinkHubEditor({ tagId, data }: LinkHubEditorProps) {
    const [title, setTitle] = useState(data?.title || '')
    const [bio, setBio] = useState(data?.bio || '')
    const [links, setLinks] = useState<Link[]>((data?.links as Link[]) || [])
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const addLink = () => {
        setLinks([...links, { title: '', url: '', icon: '🔗' }])
        setSaved(false)
    }

    const updateLink = (index: number, field: keyof Link, value: string) => {
        const newLinks = [...links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        setLinks(newLinks)
        setSaved(false)
    }

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index))
        setSaved(false)
    }

    const handleSave = async () => {
        setSaving(true)

        const payload = { title, bio, links }

        if (data) {
            await (supabase.from('link_hubs') as any)
                .update(payload)
                .eq('id', data.id)
        } else {
            await (supabase.from('link_hubs') as any)
                .insert({ ...payload, tag_id: tagId })
        }

        setSaving(false)
        setSaved(true)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-black/60 text-sm mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setSaved(false) }}
                    className="input-sketchy w-full"
                    placeholder="My Links"
                />
            </div>

            <div>
                <label className="block text-black/60 text-sm mb-2">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => { setBio(e.target.value); setSaved(false) }}
                    rows={2}
                    className="input-sketchy w-full resize-none"
                    placeholder="A short description..."
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-black/60 text-sm">Links</label>
                    <button
                        type="button"
                        onClick={addLink}
                        className="px-3 py-1.5 bg-[var(--golden)] text-black rounded-lg text-sm font-bold border-2 border-black hover:bg-[var(--golden-light)] transition-colors inline-flex items-center gap-1"
                        style={{ boxShadow: '2px 2px 0 #000' }}
                    >
                        <LuPlus /> Add Link
                    </button>
                </div>

                <div className="space-y-3">
                    {links.map((link, index) => (
                        <div key={index} className="flex gap-2 items-start bg-white p-3 rounded-lg border-2 border-black" style={{ boxShadow: '2px 2px 0 #000' }}>
                            <input
                                type="text"
                                value={link.icon}
                                onChange={(e) => updateLink(index, 'icon', e.target.value)}
                                className="w-12 px-2 py-2 border-2 border-black rounded-lg text-center text-black"
                                placeholder="🔗"
                            />
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={link.title}
                                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                                    className="input-sketchy w-full text-sm"
                                    placeholder="Link Title"
                                />
                                <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                                    className="input-sketchy w-full text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeLink(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LuX className="text-lg" />
                            </button>
                        </div>
                    ))}

                    {links.length === 0 && (
                        <p className="text-black/40 text-center py-6 text-sm border-2 border-dashed border-black/20 rounded-lg">No links yet. Click &quot;Add Link&quot; to get started.</p>
                    )}
                </div>
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
                    <><LuSave className="text-lg" /><span>Save Link Hub</span></>
                )}
            </button>
        </div>
    )
}
