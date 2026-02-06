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
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    {/* Avatar */}
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-200 flex items-center justify-center text-2xl font-medium text-stone-600">
                        {data.title ? data.title.charAt(0).toUpperCase() : '?'}
                    </div>

                    {/* Name */}
                    <h1 className="text-2xl font-semibold text-stone-900 mb-2">
                        {data.title || 'Your Name'}
                    </h1>

                    {/* Bio */}
                    {data.bio && (
                        <p className="text-stone-500 max-w-xs mx-auto">
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
                            className="group flex items-center justify-between w-full px-5 py-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {link.icon && (
                                    <span className="text-lg">{link.icon}</span>
                                )}
                                <span className="text-stone-700 font-medium">
                                    {link.title}
                                </span>
                            </div>
                            <svg
                                className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    )) : (
                        <div className="text-center py-12 text-stone-400">
                            <p>No links added yet</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-stone-400 text-xs mt-10">
                    Powered by Nexo
                </p>
            </div>
        </div>
    )
}
