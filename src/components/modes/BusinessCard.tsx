'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BusinessCard } from '@/lib/types/database'
import {
    LuMail,
    LuPhone,
    LuGlobe,
    LuLinkedin,
    LuDownload,
    LuSparkles,
    LuCheck,
    LuCopy
} from 'react-icons/lu'

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
        <div className="min-h-screen">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    {/* Avatar */}
                    <div className="w-28 h-28 mx-auto mb-4 rounded-full border-3 border-black bg-white flex items-center justify-center text-2xl font-bold text-black overflow-hidden relative"
                        style={{ boxShadow: '4px 4px 0 var(--golden)' }}>
                        {data.avatar_url ? (
                            <Image
                                src={data.avatar_url}
                                alt={data.name || 'Profile'}
                                fill
                                className="object-cover"
                                sizes="112px"
                            />
                        ) : (
                            <span>{data.name ? data.name.charAt(0).toUpperCase() : '?'}</span>
                        )}
                    </div>

                    {/* Name & Title */}
                    <h1 className="text-2xl font-bold text-black mb-1">
                        {data.name || 'Your Name'}
                    </h1>
                    <p className="text-black/60 font-medium">
                        {data.title}{data.title && data.company && ' · '}{data.company}
                    </p>
                </div>

                {/* Bio */}
                {data.bio && (
                    <p className="text-black/70 text-center mb-10 leading-relaxed">
                        {data.bio}
                    </p>
                )}

                {/* Contact Info */}
                <div className="shadow-golden mb-6 overflow-hidden">
                    {data.email && (
                        <button
                            onClick={() => handleCopy(data.email!, 'email')}
                            className="w-full flex items-center justify-between px-4 py-4 hover:bg-[var(--golden-light)] transition-colors text-left border-b-2 border-black last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[var(--golden)] rounded-lg border-2 border-black flex items-center justify-center">
                                    <LuMail className="text-black" />
                                </div>
                                <span className="text-black font-medium">{data.email}</span>
                            </div>
                            <span className="badge-golden text-xs flex items-center gap-1">
                                {copied === 'email' ? <><LuCheck /> Copied!</> : <><LuCopy /> Copy</>}
                            </span>
                        </button>
                    )}

                    {data.phone && (
                        <a
                            href={`tel:${data.phone}`}
                            className="flex items-center justify-between px-4 py-4 hover:bg-[var(--golden-light)] transition-colors border-b-2 border-black last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[var(--blue)] rounded-lg border-2 border-black flex items-center justify-center">
                                    <LuPhone className="text-black" />
                                </div>
                                <span className="text-black font-medium">{data.phone}</span>
                            </div>
                            <span className="badge-blue text-xs">Call</span>
                        </a>
                    )}

                    {data.website && (
                        <a
                            href={data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-4 hover:bg-[var(--golden-light)] transition-colors border-b-2 border-black last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[var(--golden)] rounded-lg border-2 border-black flex items-center justify-center">
                                    <LuGlobe className="text-black" />
                                </div>
                                <span className="text-black font-medium truncate max-w-[200px]">
                                    {data.website.replace(/^https?:\/\//, '')}
                                </span>
                            </div>
                            <span className="badge-blue text-xs">Open</span>
                        </a>
                    )}

                    {data.linkedin && (
                        <a
                            href={data.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-4 hover:bg-[var(--golden-light)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[var(--blue)] rounded-lg border-2 border-black flex items-center justify-center">
                                    <LuLinkedin className="text-black" />
                                </div>
                                <span className="text-black font-medium">LinkedIn</span>
                            </div>
                            <span className="badge-blue text-xs">Open</span>
                        </a>
                    )}
                </div>

                {/* Save Contact Button */}
                <button
                    onClick={handleSaveContact}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                >
                    <LuDownload /> Save Contact
                </button>

                {/* Footer */}
                <p className="text-center text-black/40 text-xs mt-8 font-medium flex items-center justify-center gap-1">
                    <LuSparkles className="text-[var(--golden)]" /> Powered by Nexo
                </p>
            </div>
        </div>
    )
}
