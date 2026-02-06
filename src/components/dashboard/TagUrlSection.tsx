'use client'

import { useState } from 'react'

interface TagUrlSectionProps {
    tagUrl: string
    tagCode: string
}

export default function TagUrlSection({ tagUrl, tagCode }: TagUrlSectionProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(tagUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-stone-400 text-xs mb-2">Tag URL</p>
            <div className="flex items-center gap-2">
                <p className="flex-1 font-mono text-stone-900 text-sm truncate">{tagUrl}</p>
                <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-stone-500 hover:text-stone-700 text-xs transition-colors"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
                <a
                    href={tagUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                    Open
                </a>
            </div>
        </div>
    )
}
