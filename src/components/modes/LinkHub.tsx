'use client'

import type { LinkHub } from '@/lib/types/database'

interface LinkHubProps {
    data: LinkHub
}

interface Link {
    title: string
    url: string
    icon?: string
}

export default function LinkHubMode({ data }: LinkHubProps) {
    const links = (data.links as Link[]) || []

    return (
        <div className="min-h-screen">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    {/* Avatar */}
                    <div
                        className="w-24 h-24 mx-auto mb-4 rounded-full border-3 border-black bg-[var(--golden)] flex items-center justify-center text-3xl font-bold text-black"
                        style={{ boxShadow: '4px 4px 0 var(--black)' }}
                    >
                        {data.title ? data.title.charAt(0).toUpperCase() : '🔗'}
                    </div>

                    {/* Name */}
                    <h1 className="text-2xl font-bold text-black mb-2">
                        {data.title || 'My Links'}
                    </h1>

                    {/* Bio */}
                    {data.bio && (
                        <p className="text-black/60 max-w-xs mx-auto font-medium">
                            {data.bio}
                        </p>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {links.length > 0 ? links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center justify-between w-full px-5 py-4 bg-white rounded-xl border-2 border-black transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]`}
                            style={{
                                boxShadow: `4px 4px 0 ${index % 2 === 0 ? 'var(--golden)' : 'var(--blue)'}`
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {link.icon && (
                                    <span className="text-xl">{link.icon}</span>
                                )}
                                <span className="text-black font-bold">
                                    {link.title}
                                </span>
                            </div>
                            <span className="text-black font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    )) : (
                        <div className="text-center py-12 shadow-golden">
                            <p className="text-black/60 font-medium">No links added yet</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-black/40 text-xs mt-10 font-medium">
                    ✨ Powered by Nexo
                </p>
            </div>
        </div>
    )
}
