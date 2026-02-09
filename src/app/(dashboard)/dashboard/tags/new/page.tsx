'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: TypeScript types for Supabase will work properly once the database is set up
// and types are generated using: npx supabase gen types typescript

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateTagCode } from '@/lib/utils/tag-codes'
import type { TagMode, Tag, Profile } from '@/lib/types/database'
import {
    LuArrowLeft,
    LuBriefcase,
    LuWifi,
    LuLink,
    LuHeart,
    LuExternalLink,
    LuSparkles
} from 'react-icons/lu'

const modes: { value: TagMode; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'business_card', label: 'Business Card', icon: <LuBriefcase />, description: 'Share your contact details and professional info' },
    { value: 'wifi', label: 'Wi-Fi', icon: <LuWifi />, description: 'Let guests connect to your network instantly' },
    { value: 'link_hub', label: 'Link Hub', icon: <LuLink />, description: 'Linktree-style page with all your links' },
    { value: 'emergency', label: 'Emergency', icon: <LuHeart />, description: 'Medical info and emergency contacts' },
    { value: 'redirect', label: 'Redirect', icon: <LuExternalLink />, description: 'Redirect to any URL of your choice' },
]

export default function NewTagPage() {
    const [label, setLabel] = useState('')
    const [selectedMode, setSelectedMode] = useState<TagMode>('business_card')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in to create a tag')
            setLoading(false)
            return
        }

        const code = generateTagCode()

        const { data: tag, error: tagError } = await supabase
            .from('tags')
            .insert({
                code,
                user_id: user.id,
                label: label || 'My Tag',
                active_mode: selectedMode,
            } as any)
            .select()
            .single() as { data: Tag | null, error: any }

        if (tagError || !tag) {
            setError(tagError?.message || 'Failed to create tag')
            setLoading(false)
            return
        }

        // Create default mode data based on selected mode
        if (selectedMode === 'business_card') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single() as { data: Profile | null }

            await supabase.from('business_cards').insert({
                tag_id: tag.id,
                name: profile?.full_name || 'Your Name',
                email: user.email,
            } as any)
        } else if (selectedMode === 'wifi') {
            await supabase.from('wifi_configs').insert({
                tag_id: tag.id,
                ssid: 'My Network',
                password: 'password123',
                security: 'WPA2',
            } as any)
        } else if (selectedMode === 'link_hub') {
            await supabase.from('link_hubs').insert({
                tag_id: tag.id,
                title: 'My Links',
                links: [],
            } as any)
        } else if (selectedMode === 'emergency') {
            await supabase.from('emergency_infos').insert({
                tag_id: tag.id,
            } as any)
        } else if (selectedMode === 'redirect') {
            await supabase.from('custom_redirects').insert({
                tag_id: tag.id,
                url: 'https://example.com',
            } as any)
        }

        router.push(`/dashboard/tags/${tag.id}`)
        router.refresh()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-black/60 hover:text-black text-sm font-medium transition-colors">
                    <LuArrowLeft /> Back to Dashboard
                </Link>
            </div>

            <div className="shadow-blue p-6">
                <h1 className="text-xl font-bold text-black mb-1 flex items-center gap-2">
                    Create New Tag <LuSparkles className="text-[var(--golden)]" />
                </h1>
                <p className="text-black/60 text-sm mb-6">Choose a mode for your NFC tag</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-black rounded-lg text-red-600 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreate}>
                    {/* Tag Label */}
                    <div className="mb-6">
                        <label htmlFor="label" className="block text-black font-medium text-sm mb-2">
                            Tag Name
                        </label>
                        <input
                            id="label"
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g., Office Keychain, Wallet Card"
                            className="input-sketchy w-full"
                        />
                    </div>

                    {/* Mode Selection */}
                    <div className="mb-6">
                        <label className="block text-black font-medium text-sm mb-3">
                            Select Mode
                        </label>
                        <div className="space-y-2">
                            {modes.map((mode, index) => (
                                <label
                                    key={mode.value}
                                    className={`block p-4 border-2 border-black rounded-lg cursor-pointer transition-all ${selectedMode === mode.value
                                        ? 'bg-[var(--golden-light)]'
                                        : 'bg-white hover:bg-gray-50'
                                        }`}
                                    style={{
                                        boxShadow: selectedMode === mode.value
                                            ? `3px 3px 0 ${index % 2 === 0 ? 'var(--golden)' : 'var(--blue)'}`
                                            : 'none'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="mode"
                                        value={mode.value}
                                        checked={selectedMode === mode.value}
                                        onChange={() => setSelectedMode(mode.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${index % 2 === 0 ? 'bg-[var(--golden)]' : 'bg-[var(--blue)]'} rounded-lg border-2 border-black flex items-center justify-center text-lg text-black`}>
                                            {mode.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black">{mode.label}</p>
                                            <p className="text-black/60 text-sm">{mode.description}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Tag →'}
                    </button>
                </form>
            </div>
        </div>
    )
}
