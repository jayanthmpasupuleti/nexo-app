'use client'

import { useState } from 'react'
import type { BusinessCard } from '@/lib/types/database'

interface BusinessCardProps {
    data: BusinessCard
}

export default function BusinessCardMode({ data }: BusinessCardProps) {
    const [copied, setCopied] = useState(false)

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

    const handleCopyEmail = async () => {
        if (data.email) {
            await navigator.clipboard.writeText(data.email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col items-center">
                {/* Profile Photo */}
                <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-5xl">
                            {data.name ? data.name.charAt(0).toUpperCase() : '👤'}
                        </div>
                    </div>
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/50 to-pink-400/50 blur-xl -z-10 animate-pulse" />
                </div>

                {/* Name */}
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-2 text-center">
                    {data.name || 'Your Name'}
                </h1>

                {/* Title & Company */}
                <p className="text-purple-300 text-lg mb-1">{data.title || 'Your Title'}</p>
                <p className="text-purple-400/70 text-sm mb-8">{data.company || 'Your Company'}</p>

                {/* Contact Icons Row */}
                <div className="flex gap-4 mb-8">
                    {data.phone && (
                        <a href={`tel:${data.phone}`} className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
                            <span className="text-2xl">📞</span>
                        </a>
                    )}
                    {data.email && (
                        <button onClick={handleCopyEmail} className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 relative">
                            <span className="text-2xl">✉️</span>
                            {copied && (
                                <span className="absolute -bottom-8 text-xs text-green-400">Copied!</span>
                            )}
                        </button>
                    )}
                    {data.website && (
                        <a href={data.website} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
                            <span className="text-2xl">🌐</span>
                        </a>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
                            <span className="text-2xl">💼</span>
                        </a>
                    )}
                </div>

                {/* Bio */}
                {data.bio && (
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8 w-full">
                        <p className="text-white/80 text-center leading-relaxed">
                            {data.bio}
                        </p>
                    </div>
                )}

                {/* Save Contact Button */}
                <button
                    onClick={handleSaveContact}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25 mb-4"
                >
                    💾 Save Contact
                </button>

                {/* Add to Wallet Button */}
                <button className="w-full py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    📲 Add to Wallet
                </button>

                {/* Powered by */}
                <p className="text-white/30 text-xs mt-8">Powered by Nexo</p>
            </div>
        </div>
    )
}
