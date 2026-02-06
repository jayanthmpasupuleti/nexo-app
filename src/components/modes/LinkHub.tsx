'use client'

import type { LinkHub } from '@/lib/types/database'

interface LinkHubProps {
    data: LinkHub
}

interface Link {
    title: string
    url: string
    icon: string
}

const iconMap: Record<string, string> = {
    instagram: '📸',
    youtube: '🎬',
    twitter: '🐦',
    linkedin: '💼',
    github: '💻',
    website: '🌐',
    blog: '📝',
    email: '✉️',
    tiktok: '🎵',
    spotify: '🎧',
    default: '🔗'
}

function getIcon(title: string, icon?: string): string {
    if (icon) return icon
    const lower = title.toLowerCase()
    for (const [key, value] of Object.entries(iconMap)) {
        if (lower.includes(key)) return value
    }
    return iconMap.default
}

export default function LinkHubMode({ data }: LinkHubProps) {
    const links = (data.links as Link[]) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-slate-900 relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col items-center">
                {/* Profile Photo */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-4xl">
                        {data.title ? data.title.charAt(0).toUpperCase() : '👤'}
                    </div>
                </div>

                {/* Name */}
                <h1 className="text-2xl font-bold text-white mb-2 text-center">
                    {data.title || 'Your Name'}
                </h1>

                {/* Bio */}
                <p className="text-pink-300/80 text-center mb-8 max-w-xs">
                    {data.bio || 'Your bio goes here'}
                </p>

                {/* Links */}
                <div className="w-full space-y-3 mb-8">
                    {links.length > 0 ? links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-full flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all"
                        >
                            <span className="text-2xl">{getIcon(link.title, link.icon)}</span>
                            <span className="text-white font-medium flex-1 text-center">
                                {link.title}
                            </span>
                            <span className="text-white/40 group-hover:text-white/60 transition-colors">
                                →
                            </span>
                        </a>
                    )) : (
                        <div className="text-center py-8 text-white/40">
                            <p>No links added yet</p>
                        </div>
                    )}
                </div>

                {/* Powered by */}
                <div className="flex items-center gap-2 text-white/30 text-xs">
                    <span className="text-lg">⚡</span>
                    <span>Powered by Nexo</span>
                </div>
            </div>
        </div>
    )
}
