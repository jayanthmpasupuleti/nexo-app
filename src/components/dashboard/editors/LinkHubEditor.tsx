'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { LinkHub } from '@/lib/types/database'

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
    const router = useRouter()
    const supabase = createClient()

    const addLink = () => {
        setLinks([...links, { title: '', url: '', icon: '🔗' }])
    }

    const updateLink = (index: number, field: keyof Link, value: string) => {
        const newLinks = [...links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        setLinks(newLinks)
    }

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index))
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
        router.refresh()
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="My Links"
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="A short description..."
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-gray-700 text-sm font-medium">Links</label>
                    <button
                        type="button"
                        onClick={addLink}
                        className="text-purple-600 text-sm font-medium hover:text-purple-700"
                    >
                        + Add Link
                    </button>
                </div>

                <div className="space-y-3">
                    {links.map((link, index) => (
                        <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                            <input
                                type="text"
                                value={link.icon}
                                onChange={(e) => updateLink(index, 'icon', e.target.value)}
                                className="w-12 px-2 py-2 border border-gray-200 rounded-lg text-center"
                                placeholder="🔗"
                            />
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={link.title}
                                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="Link Title"
                                />
                                <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeLink(index)}
                                className="text-red-500 hover:text-red-700 p-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {links.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No links yet. Click &quot;Add Link&quot; to get started.</p>
                    )}
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'Save Link Hub'}
            </button>
        </div>
    )
}
