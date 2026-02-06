'use client'

import { useState } from 'react'
import type { BusinessCard } from '@/lib/types/database'

interface BusinessCardProps {
    data: BusinessCard
}

export default function BusinessCardMode({ data }: BusinessCardProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const generateVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name || ''}
TITLE:${data.title || ''}
ORG:${data.company || ''}
TEL:${data.phone || ''}
EMAIL:${data.email || ''}
URL:${data.website || ''}
NOTE:${data.bio || ''}
END:VCARD`
        return vcard
    }

    const handleSaveContact = () => {
        const vcard = generateVCard()
        const blob = new Blob([vcard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${data.name || 'contact'}.vcf`
        link.click()
        URL.revokeObjectURL(url)
    }

    const handleCopy = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    {/* Avatar */}
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-200 flex items-center justify-center text-2xl font-medium text-stone-600">
                        {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                    </div>

                    {/* Name & Title */}
                    <h1 className="text-2xl font-semibold text-stone-900 mb-1">
                        {data.name || 'Your Name'}
                    </h1>
                    <p className="text-stone-500">
                        {data.title}{data.title && data.company && ' · '}{data.company}
                    </p>
                </div>

                {/* Bio */}
                {data.bio && (
                    <p className="text-stone-600 text-center mb-10 leading-relaxed">
                        {data.bio}
                    </p>
                )}

                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 mb-6">
                    {data.email && (
                        <button
                            onClick={() => handleCopy(data.email!, 'email')}
                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-stone-400">✉️</span>
                                <span className="text-stone-600">{data.email}</span>
                            </div>
                            <span className="text-xs text-stone-400">
                                {copied === 'email' ? 'Copied!' : 'Copy'}
                            </span>
                        </button>
                    )}

                    {data.phone && (
                        <a
                            href={`tel:${data.phone}`}
                            className="flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-stone-400">📞</span>
                                <span className="text-stone-600">{data.phone}</span>
                            </div>
                            <span className="text-xs text-stone-400">Call</span>
                        </a>
                    )}

                    {data.website && (
                        <a
                            href={data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-stone-400">🌐</span>
                                <span className="text-stone-600 truncate max-w-[200px]">
                                    {data.website.replace(/^https?:\/\//, '')}
                                </span>
                            </div>
                            <span className="text-xs text-stone-400">Open</span>
                        </a>
                    )}

                    {data.linkedin && (
                        <a
                            href={data.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-stone-400">💼</span>
                                <span className="text-stone-600">LinkedIn</span>
                            </div>
                            <span className="text-xs text-stone-400">Open</span>
                        </a>
                    )}
                </div>

                {/* Save Contact Button */}
                <button
                    onClick={handleSaveContact}
                    className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                >
                    Save Contact
                </button>

                {/* Footer */}
                <p className="text-center text-stone-400 text-xs mt-8">
                    Powered by Nexo
                </p>
            </div>
        </div>
    )
}
