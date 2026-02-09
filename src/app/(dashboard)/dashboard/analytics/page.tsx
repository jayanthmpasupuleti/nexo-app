/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import StatCard from '@/components/dashboard/analytics/StatCard'
import type { Tag, TapEvent } from '@/lib/types/database'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return <div>Please log in to view analytics.</div>
    }

    // Get all tags for user with tap counts
    const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('tap_count', { ascending: false }) as { data: Tag[] | null }

    // Get recent tap events across all user tags
    const tagIds = tags?.map(t => t.id) || []

    let recentTaps: TapEvent[] = []
    let todayTaps = 0
    let weekTaps = 0
    let monthTaps = 0

    if (tagIds.length > 0) {
        // Get recent taps
        const { data: taps } = await (supabase
            .from('tap_events')
            .select('*')
            .in('tag_id', tagIds)
            .order('tapped_at', { ascending: false })
            .limit(10) as any)

        recentTaps = taps || []

        // Get today's count
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: todayCount } = await (supabase
            .from('tap_events')
            .select('*', { count: 'exact', head: true })
            .in('tag_id', tagIds)
            .gte('tapped_at', today.toISOString()) as any)

        todayTaps = todayCount || 0

        // Get this week's count
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const { count: weekCount } = await (supabase
            .from('tap_events')
            .select('*', { count: 'exact', head: true })
            .in('tag_id', tagIds)
            .gte('tapped_at', weekAgo.toISOString()) as any)

        weekTaps = weekCount || 0

        // Get this month's count
        const monthAgo = new Date()
        monthAgo.setDate(monthAgo.getDate() - 30)

        const { count: monthCount } = await (supabase
            .from('tap_events')
            .select('*', { count: 'exact', head: true })
            .in('tag_id', tagIds)
            .gte('tapped_at', monthAgo.toISOString()) as any)

        monthTaps = monthCount || 0
    }

    // Total taps across all tags
    const totalTaps = tags?.reduce((sum, tag) => sum + tag.tap_count, 0) || 0

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard" className="text-stone-500 hover:text-stone-700 text-sm transition-colors">
                    ← Back to Dashboard
                </Link>
            </div>

            <h1 className="text-2xl font-semibold text-stone-900 mb-6">Analytics</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Taps" value={totalTaps} icon="📊" />
                <StatCard label="Today" value={todayTaps} icon="📅" />
                <StatCard label="This Week" value={weekTaps} icon="📈" />
                <StatCard label="This Month" value={monthTaps} icon="🗓️" />
            </div>

            {/* Top Tags */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
                <h2 className="font-medium text-stone-900 mb-4">Top Performing Tags</h2>

                {tags && tags.length > 0 ? (
                    <div className="space-y-3">
                        {tags.slice(0, 5).map((tag, index) => (
                            <Link
                                key={tag.id}
                                href={`/dashboard/tags/${tag.id}/analytics`}
                                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-600">
                                        {index + 1}
                                    </span>
                                    <span className="text-stone-700">{tag.label || tag.code}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-stone-900 font-medium">{tag.tap_count}</span>
                                    <span className="text-stone-400 text-sm">taps</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500 text-sm">No tags yet. Create one to start tracking!</p>
                )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h2 className="font-medium text-stone-900 mb-4">Recent Activity</h2>

                {recentTaps.length > 0 ? (
                    <div className="space-y-3">
                        {recentTaps.map(tap => {
                            const tag = tags?.find(t => t.id === tap.tag_id)
                            const timeAgo = getRelativeTime(tap.tapped_at)

                            return (
                                <div key={tap.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">📱</span>
                                        <div>
                                            <span className="text-stone-700">{tag?.label || 'Tag'}</span>
                                            <span className="text-stone-400"> was scanned</span>
                                        </div>
                                    </div>
                                    <span className="text-stone-400 text-sm">{timeAgo}</span>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-stone-500 text-sm">No taps recorded yet. Share your tags to start!</p>
                )}
            </div>
        </div>
    )
}

function getRelativeTime(date: string): string {
    const now = new Date()
    const tapDate = new Date(date)
    const diffMs = now.getTime() - tapDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return tapDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
