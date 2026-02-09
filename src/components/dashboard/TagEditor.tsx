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
import {
    LuBriefcase,
    LuWifi,
    LuLink,
    LuHeart,
    LuExternalLink,
    LuTrash2
} from 'react-icons/lu'

interface TagEditorProps {
    tag: TagWithData
}

const modes: { value: TagMode; label: string; icon: React.ReactNode }[] = [
    { value: 'business_card', label: 'Business Card', icon: <LuBriefcase /> },
    { value: 'wifi', label: 'Wi-Fi', icon: <LuWifi /> },
    { value: 'link_hub', label: 'Link Hub', icon: <LuLink /> },
    { value: 'emergency', label: 'Emergency', icon: <LuHeart /> },
    { value: 'redirect', label: 'Redirect', icon: <LuExternalLink /> },
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

    const activeModeData = modes.find(m => m.value === activeMode)

    return (
        <div className="space-y-6">
            {/* Tag Settings */}
            <div className="shadow-golden p-6">
                <h2 className="font-bold text-black mb-4">Tag Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="label" className="block text-black/60 text-sm mb-2">
                            Tag Name
                        </label>
                        <input
                            id="label"
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="input-sketchy w-full"
                            placeholder="My Business Card"
                        />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b-2 border-black/10">
                        <div>
                            <p className="font-bold text-black">Active</p>
                            <p className="text-black/60 text-sm">When disabled, the tag won&apos;t load for visitors</p>
                        </div>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`relative w-11 h-6 rounded-full transition-colors border-2 border-black ${isActive ? 'bg-green-400' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform border border-black ${isActive ? 'translate-x-5' : ''
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Mode Selector */}
                    <div>
                        <label className="block text-black/60 text-sm mb-2">
                            Active Mode
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {modes.map((mode, index) => (
                                <button
                                    key={mode.value}
                                    onClick={() => setActiveMode(mode.value)}
                                    className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border-2 border-black flex items-center justify-center gap-1 ${activeMode === mode.value
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black hover:bg-gray-50'
                                        }`}
                                    style={{
                                        boxShadow: activeMode === mode.value
                                            ? `2px 2px 0 ${index % 2 === 0 ? 'var(--golden)' : 'var(--blue)'}`
                                            : 'none'
                                    }}
                                >
                                    <span className="text-base">{mode.icon}</span>
                                    <span className="hidden sm:inline">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveTag}
                        disabled={saving}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Tag Settings'}
                    </button>
                </div>
            </div>

            {/* Mode Editor */}
            <div className="shadow-blue p-6">
                <h2 className="font-bold text-black mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[var(--blue)] rounded-lg border-2 border-black flex items-center justify-center">
                        {activeModeData?.icon}
                    </span>
                    {activeModeData?.label} Settings
                </h2>
                {renderModeEditor()}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl border-2 border-black p-6" style={{ boxShadow: '4px 4px 0 #ef4444' }}>
                <h2 className="font-bold text-black mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-400 rounded-lg border-2 border-black flex items-center justify-center">
                        <LuTrash2 className="text-black" />
                    </span>
                    Danger Zone
                </h2>
                <p className="text-black/70 text-sm mb-4">
                    Once you delete a tag, there is no going back.
                </p>
                <div className="flex gap-2">
                    {confirmDelete ? (
                        <>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold border-2 border-black hover:bg-red-600 disabled:opacity-50 transition-colors"
                                style={{ boxShadow: '2px 2px 0 #000' }}
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete Forever'}
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                disabled={deleting}
                                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold border-2 border-black hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                style={{ boxShadow: '2px 2px 0 #000' }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold border-2 border-black hover:bg-red-600 transition-colors"
                            style={{ boxShadow: '2px 2px 0 #000' }}
                        >
                            Delete Tag
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
