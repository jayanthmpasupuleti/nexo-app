import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getTagUrl } from '@/lib/utils/tag-codes'
import type { Tag } from '@/lib/types/database'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: tags, error } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Tag[] | null, error: unknown }

    if (error) {
        console.error('Error fetching tags:', error)
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-900">Your Tags</h1>
                    <p className="text-stone-500 mt-1 text-sm">Manage your NFC tags and their modes</p>
                </div>
                <Link
                    href="/dashboard/tags/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                    <span>+</span>
                    <span>Create Tag</span>
                </Link>
            </div>

            {/* Tags Grid */}
            {(!tags || tags.length === 0) ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tags.map((tag) => (
                        <TagCard key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    )
}

function TagCard({ tag }: { tag: Tag }) {
    const modeIcons: Record<string, string> = {
        business_card: '💼',
        wifi: '📶',
        link_hub: '🔗',
        emergency: '🏥',
        redirect: '↗️',
    }

    const modeNames: Record<string, string> = {
        business_card: 'Business Card',
        wifi: 'Wi-Fi',
        link_hub: 'Link Hub',
        emergency: 'Emergency',
        redirect: 'Redirect',
    }

    return (
        <Link
            href={`/dashboard/tags/${tag.id}`}
            className="block bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 hover:shadow-sm transition-all"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{modeIcons[tag.active_mode] || '🏷️'}</div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${tag.is_active
                    ? 'bg-green-50 text-green-600'
                    : 'bg-stone-100 text-stone-500'
                    }`}>
                    {tag.is_active ? 'Active' : 'Inactive'}
                </div>
            </div>

            <h3 className="font-medium text-stone-900 mb-1">
                {tag.label || 'Untitled Tag'}
            </h3>
            <p className="text-stone-500 text-sm mb-3">
                {modeNames[tag.active_mode] || tag.active_mode}
            </p>

            <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono">{tag.code}</span>
                <span className="text-stone-400">{tag.tap_count} taps</span>
            </div>
        </Link>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-200">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="font-medium text-stone-900 mb-2">No tags yet</h3>
            <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
                Create your first NFC tag to start sharing your digital identity.
            </p>
            <Link
                href="/dashboard/tags/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
            >
                <span>+</span>
                <span>Create Your First Tag</span>
            </Link>
        </div>
    )
}
