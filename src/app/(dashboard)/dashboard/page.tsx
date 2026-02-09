import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
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
                    <h1 className="text-2xl font-bold text-black">Your Tags</h1>
                    <p className="text-black/60 mt-1 text-sm">Manage your NFC tags and their modes</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/analytics"
                        className="btn-secondary inline-flex items-center gap-2 text-sm"
                    >
                        <span>📊</span>
                        <span>Analytics</span>
                    </Link>
                    <Link
                        href="/dashboard/tags/new"
                        className="btn-primary inline-flex items-center gap-2 text-sm"
                    >
                        <span>+</span>
                        <span>Create Tag</span>
                    </Link>
                </div>
            </div>

            {/* Tags Grid */}
            {(!tags || tags.length === 0) ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tags.map((tag, index) => (
                        <TagCard key={tag.id} tag={tag} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

function TagCard({ tag, index }: { tag: Tag; index: number }) {
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

    // Alternate between golden and blue shadows
    const shadowClass = index % 2 === 0 ? 'shadow-golden' : 'shadow-blue'

    return (
        <Link
            href={`/dashboard/tags/${tag.id}`}
            className={`block p-5 ${shadowClass} card-hover`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{modeIcons[tag.active_mode] || '🏷️'}</div>
                <div className={`${tag.is_active ? 'badge-golden' : 'badge-blue'}`}>
                    {tag.is_active ? 'Active' : 'Inactive'}
                </div>
            </div>

            <h3 className="font-semibold text-black mb-1">
                {tag.label || 'Untitled Tag'}
            </h3>
            <p className="text-black/60 text-sm mb-3">
                {modeNames[tag.active_mode] || tag.active_mode}
            </p>

            <div className="flex items-center justify-between text-xs">
                <span className="text-black/40 font-mono">{tag.code}</span>
                <span className="text-black/40">{tag.tap_count} taps</span>
            </div>
        </Link>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-16 shadow-golden">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="font-semibold text-black mb-2">No tags yet</h3>
            <p className="text-black/60 text-sm mb-6 max-w-sm mx-auto">
                Create your first NFC tag to start sharing your digital identity.
            </p>
            <Link
                href="/dashboard/tags/new"
                className="btn-primary inline-flex items-center gap-2"
            >
                <span>+</span>
                <span>Create Your First Tag</span>
            </Link>
        </div>
    )
}
