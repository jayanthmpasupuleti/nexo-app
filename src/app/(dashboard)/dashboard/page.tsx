import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Tag } from '@/lib/types/database'
import {
    LuBriefcase,
    LuWifi,
    LuLink,
    LuHeart,
    LuExternalLink,
    LuTag,
    LuChartBar,
    LuPlus
} from 'react-icons/lu'

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
                        className="btn-secondary"
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', whiteSpace: 'nowrap' }}
                    >
                        <LuChartBar className="text-lg" style={{ flexShrink: 0 }} />
                        <span>Analytics</span>
                    </Link>
                    <Link
                        href="/dashboard/tags/new"
                        className="btn-primary"
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', whiteSpace: 'nowrap' }}
                    >
                        <LuPlus className="text-lg" style={{ flexShrink: 0 }} />
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

    return (
        <Link
            href={`/dashboard/tags/${tag.id}`}
            className={`block p-5 ${shadowClass} card-hover`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${iconBg} rounded-lg border-2 border-black flex items-center justify-center text-lg text-black`}>
                    {modeIcons[tag.active_mode] || <LuTag />}
                </div>
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
            <div className="w-16 h-16 bg-[var(--golden)] rounded-xl border-2 border-black flex items-center justify-center text-2xl text-black mx-auto mb-4">
                <LuTag />
            </div>
            <h3 className="font-semibold text-black mb-2">No tags yet</h3>
            <p className="text-black/60 text-sm mb-6 max-w-sm mx-auto">
                Create your first NFC tag to start sharing your digital identity.
            </p>
            <Link
                href="/dashboard/tags/new"
                className="btn-primary inline-flex items-center gap-2"
            >
                <LuPlus />
                <span>Create Your First Tag</span>
            </Link>
        </div>
    )
}
