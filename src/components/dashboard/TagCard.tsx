'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Tag } from '@/lib/types/database'
import { getTagUrl } from '@/lib/utils/tag-codes'
import QRCodeDisplay from '@/components/common/QRCodeDisplay'
import {
    LuBriefcase,
    LuWifi,
    LuLink,
    LuHeart,
    LuExternalLink,
    LuTag,
    LuQrCode
} from 'react-icons/lu'

interface TagCardProps {
    tag: Tag
    index: number
}

export default function TagCard({ tag, index }: TagCardProps) {
    const [showQR, setShowQR] = useState(false)

    const modeIcons: Record<string, React.ReactNode> = {
        business_card: <LuBriefcase />,
        wifi: <LuWifi />,
        link_hub: <LuLink />,
        emergency: <LuHeart />,
        redirect: <LuExternalLink />,
    }

    const modeNames: Record<string, string> = {
        business_card: 'Business Card',
        wifi: 'Wi-Fi',
        link_hub: 'Link Hub',
        emergency: 'Emergency',
        redirect: 'Redirect',
    }

    // Alternate between golden and blue shadows
    const shadowClass = index % 2 === 0 ? 'shadow-golden' : 'shadow-blue'
    const iconBg = index % 2 === 0 ? 'bg-[var(--golden)]' : 'bg-[var(--blue)]'
    const tagUrl = getTagUrl(tag.code)

    const handleQRClick = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation to tag details
        e.stopPropagation()
        setShowQR(true)
    }

    return (
        <>
            <div className={`relative group ${shadowClass} card-hover transition-all`}>
                <Link
                    href={`/dashboard/tags/${tag.id}`}
                    className="block p-5 h-full"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 ${iconBg} rounded-lg border-2 border-black flex items-center justify-center text-lg text-black`}>
                            {modeIcons[tag.active_mode] || <LuTag />}
                        </div>
                        <div className={`${tag.is_active ? 'badge-golden' : 'badge-blue'}`}>
                            {tag.is_active ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    <div className="pr-8">
                        <h3 className="font-semibold text-black mb-1 truncate">
                            {tag.label || 'Untitled Tag'}
                        </h3>
                        <p className="text-black/60 text-sm mb-3">
                            {modeNames[tag.active_mode] || tag.active_mode}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-black/40 font-mono bg-black/5 px-2 py-0.5 rounded">{tag.code}</span>
                        <span className="text-black/40 font-medium transition-opacity duration-200 group-hover:opacity-0">{tag.tap_count} taps</span>
                    </div>
                </Link>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowQR(true)
                        }}
                        className="p-2 bg-white rounded-full border-2 border-black hover:bg-gray-50 shadow-[2px_2px_0_#000]"
                        title="Show QR Code"
                    >
                        <LuQrCode className="text-lg text-black" />
                    </button>
                </div>
            </div>

            {showQR && (
                <QRCodeDisplay url={tagUrl} onClose={() => setShowQR(false)} />
            )}
        </>
    )
}
