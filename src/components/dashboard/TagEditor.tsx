'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { TagWithData, TagMode } from '@/lib/types/database'
import BusinessCardEditor from './editors/BusinessCardEditor'
import WiFiEditor from './editors/WiFiEditor'
import LinkHubEditor from './editors/LinkHubEditor'
import EmergencyEditor from './editors/EmergencyEditor'
import RedirectEditor from './editors/RedirectEditor'

interface TagEditorProps {
    tag: TagWithData
}

const modes: { value: TagMode; label: string; icon: string }[] = [
    { value: 'business_card', label: 'Business Card', icon: '💼' },
    { value: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { value: 'link_hub', label: 'Link Hub', icon: '🔗' },
    { value: 'emergency', label: 'Emergency', icon: '🏥' },
    { value: 'redirect', label: 'Redirect', icon: '↗️' },
]

export default function TagEditor({ tag }: TagEditorProps) {
    const [activeMode, setActiveMode] = useState<TagMode>(tag.active_mode)
    const [label, setLabel] = useState(tag.label || '')
    const [isActive, setIsActive] = useState(tag.is_active)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [deleting, setDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleSaveTag = async () => {
        setSaving(true)

        await (supabase.from('tags') as any)
            .update({
                label,
                active_mode: activeMode,
                is_active: isActive,
            })
            .eq('id', tag.id)

        setSaving(false)
        router.refresh()
    }

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            return
        }

        setDeleting(true)

        const { error } = await (supabase.from('tags') as any)
            .delete()
            .eq('id', tag.id)

        if (error) {
            console.error('Delete error:', error)
            alert('Failed to delete tag: ' + error.message)
            setDeleting(false)
            setConfirmDelete(false)
            return
        }

        router.push('/dashboard')
        router.refresh()
    }


    const renderModeEditor = () => {
        switch (activeMode) {
            case 'business_card':
                return <BusinessCardEditor tagId={tag.id} data={tag.business_cards} />
            case 'wifi':
                return <WiFiEditor tagId={tag.id} data={tag.wifi_configs} />
            case 'link_hub':
                return <LinkHubEditor tagId={tag.id} data={tag.link_hubs} />
            case 'emergency':
                return <EmergencyEditor tagId={tag.id} data={tag.emergency_infos} />
            case 'redirect':
                return <RedirectEditor tagId={tag.id} data={tag.custom_redirects} />
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Tag Settings */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="font-medium text-stone-900 mb-4">Tag Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="label" className="block text-stone-600 text-sm mb-2">
                            Tag Name
                        </label>
                        <input
                            id="label"
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 text-stone-900"
                            placeholder="My Business Card"
                        />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-stone-100">
                        <div>
                            <p className="font-medium text-stone-900">Active</p>
                            <p className="text-stone-500 text-sm">When disabled, the tag won&apos;t load for visitors</p>
                        </div>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-stone-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : ''
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Mode Selector */}
                    <div>
                        <label className="block text-stone-600 text-sm mb-2">
                            Active Mode
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {modes.map((mode) => (
                                <button
                                    key={mode.value}
                                    onClick={() => setActiveMode(mode.value)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeMode === mode.value
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                        }`}
                                >
                                    <span className="mr-1.5">{mode.icon}</span>
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveTag}
                        disabled={saving}
                        className="w-full py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Tag Settings'}
                    </button>
                </div>
            </div>

            {/* Mode Editor */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="font-medium text-stone-900 mb-4">
                    {modes.find(m => m.value === activeMode)?.icon} {modes.find(m => m.value === activeMode)?.label} Settings
                </h2>
                {renderModeEditor()}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                <h2 className="font-medium text-red-900 mb-2">Danger Zone</h2>
                <p className="text-red-600 text-sm mb-4">
                    Once you delete a tag, there is no going back.
                </p>
                <div className="flex gap-2">
                    {confirmDelete ? (
                        <>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete Forever'}
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                disabled={deleting}
                                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-300 disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Delete Tag
                        </button>
                    )}
                </div>
            </div>

        </div>
    )
}
