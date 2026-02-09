/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import StatCard from '@/components/dashboard/analytics/StatCard'
import type { Tag, TapEvent } from '@/lib/types/database'
import {
    LuArrowLeft,
    LuChartBar,
    LuCalendar,
    LuTrendingUp,
    LuCalendarDays,
    LuTrophy,
    LuZap,
    LuSmartphone
} from 'react-icons/lu'

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
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-black/60 hover:text-black text-sm font-medium transition-colors">
                    <LuArrowLeft /> Back to Dashboard
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <LuChartBar className="text-[var(--blue)]" />
                Analytics
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Taps" value={totalTaps} icon={<LuChartBar />} />
                <StatCard label="Today" value={todayTaps} icon={<LuCalendar />} />
                <StatCard label="This Week" value={weekTaps} icon={<LuTrendingUp />} />
                <StatCard label="This Month" value={monthTaps} icon={<LuCalendarDays />} />
            </div>

            {/* Top Tags */}
            <div className="shadow-golden p-5 mb-6">
                <h2 className="font-bold text-black mb-4 flex items-center gap-2">
                    <LuTrophy className="text-[var(--golden)]" />
                    Top Performing Tags
                </h2>

                {tags && tags.length > 0 ? (
                    <div className="space-y-2">
                        {tags.slice(0, 5).map((tag, index) => (
                            <Link
                                key={tag.id}
                                href={`/dashboard/tags/${tag.id}/analytics`}
                                className="flex items-center justify-between py-3 px-4 rounded-lg border-2 border-black bg-white hover:bg-[var(--golden-light)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[var(--golden)] border-2 border-black flex items-center justify-center text-sm font-bold text-black">
                                        {index + 1}
                                    </span>
                                    <span className="text-black font-medium">{tag.label || tag.code}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="badge-golden">{tag.tap_count} taps</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-black/60 text-sm">No tags yet. Create one to start tracking!</p>
                )}
            </div>

            {/* Recent Activity */}
            <div className="shadow-blue p-5">
                <h2 className="font-bold text-black mb-4 flex items-center gap-2">
                    <LuZap className="text-[var(--blue)]" />
                    Recent Activity
                </h2>

                {recentTaps.length > 0 ? (
                    <div className="space-y-2">
                        {recentTaps.map(tap => {
                            const tag = tags?.find(t => t.id === tap.tag_id)
                            const timeAgo = getRelativeTime(tap.tapped_at)

                            return (
                                <div key={tap.id} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border-2 border-black/20">
                                    <div className="flex items-center gap-3">
                                        <LuSmartphone className="text-lg text-[var(--blue)]" />
                                        <div>
                                            <span className="text-black font-medium">{tag?.label || 'Tag'}</span>
                                            <span className="text-black/60"> was scanned</span>
                                        </div>
                                    </div>
                                    <span className="badge-blue text-xs">{timeAgo}</span>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-black/60 text-sm">No taps recorded yet. Share your tags to start!</p>
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
