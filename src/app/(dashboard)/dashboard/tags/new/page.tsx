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

const modes: { value: TagMode; label: string; icon: string; description: string }[] = [
    { value: 'business_card', label: 'Business Card', icon: '💼', description: 'Share your contact details and professional info' },
    { value: 'wifi', label: 'Wi-Fi', icon: '📶', description: 'Let guests connect to your network instantly' },
    { value: 'link_hub', label: 'Link Hub', icon: '🔗', description: 'Linktree-style page with all your links' },
    { value: 'emergency', label: 'Emergency', icon: '🏥', description: 'Medical info and emergency contacts' },
    { value: 'redirect', label: 'Redirect', icon: '↗️', description: 'Redirect to any URL of your choice' },
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
            <div className="mb-8">
                <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Tag</h1>
                <p className="text-gray-500 mb-8">Choose a mode for your NFC tag</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreate}>
                    {/* Tag Label */}
                    <div className="mb-6">
                        <label htmlFor="label" className="block text-gray-700 font-medium mb-2">
                            Tag Name
                        </label>
                        <input
                            id="label"
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g., Office Keychain, Wallet Card"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Mode Selection */}
                    <div className="mb-8">
                        <label className="block text-gray-700 font-medium mb-4">
                            Select Mode
                        </label>
                        <div className="space-y-3">
                            {modes.map((mode) => (
                                <label
                                    key={mode.value}
                                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMode === mode.value
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
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
                                        <span className="text-3xl">{mode.icon}</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">{mode.label}</p>
                                            <p className="text-gray-500 text-sm">{mode.description}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Tag'}
                    </button>
                </form>
            </div>
        </div>
    )
}
