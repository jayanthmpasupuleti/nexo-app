'use client'

import { useState } from 'react'
import { LuCopy, LuCheck, LuExternalLink } from 'react-icons/lu'

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
        <div className="bg-white rounded-lg border-2 border-black px-4 py-2 shadow-[2px_2px_0_#000]">
            <p className="text-black/40 text-xs mb-1">Tag URL</p>
            <div className="flex items-center gap-2">
                <p className="flex-1 font-mono text-black text-sm truncate">{tagUrl}</p>
                <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-white text-black text-sm font-bold transition-colors flex items-center gap-1.5 border-2 border-black rounded-lg hover:bg-gray-50"
                    style={{ boxShadow: '2px 2px 0 #000' }}
                >
                    {copied ? <><LuCheck className="text-green-600" /> Copied</> : <><LuCopy /> Copy</>}
                </button>
                <a
                    href={tagUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[var(--golden)] text-black text-sm font-bold transition-colors inline-flex items-center gap-1.5 border-2 border-black rounded-lg hover:bg-[var(--golden-light)]"
                    style={{ boxShadow: '2px 2px 0 #000' }}
                >
                    <LuExternalLink />
                    Open
                </a>
            </div>
        </div>
    )
}
