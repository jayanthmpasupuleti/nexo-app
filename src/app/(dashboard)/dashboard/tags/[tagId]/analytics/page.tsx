/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatCard from '@/components/dashboard/analytics/StatCard'
import TapChart from '@/components/dashboard/analytics/TapChart'
import RecentTaps from '@/components/dashboard/analytics/RecentTaps'
import type { Tag, TapEvent, TapCountByDay } from '@/lib/types/database'

interface TagAnalyticsPageProps {
    params: Promise<{ tagId: string }>
}

export default async function TagAnalyticsPage({ params }: TagAnalyticsPageProps) {
    const { tagId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Get the tag - only if owned by current user
    const { data: tag, error } = await supabase
        .from('tags')
        .select('*')
        .eq('id', tagId)
        .eq('user_id', user?.id ?? '')
        .single() as { data: Tag | null, error: unknown }

    if (error || !tag) {
        notFound()
    }

    // Get tap counts by day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: tapsByDay } = await (supabase
        .from('tap_events')
        .select('tapped_at')
        .eq('tag_id', tagId)
        .gte('tapped_at', sevenDaysAgo.toISOString()) as any)

    // Aggregate by day
    const dailyCounts = new Map<string, number>()
        ; (tapsByDay || []).forEach((tap: { tapped_at: string }) => {
            const date = new Date(tap.tapped_at).toISOString().split('T')[0]
            dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
        })

    const chartData: TapCountByDay[] = Array.from(dailyCounts.entries()).map(([date, count]) => ({
        tap_date: date,
        tap_count: count
    }))

    // Get recent taps
    const { data: recentTaps } = await (supabase
        .from('tap_events')
        .select('*')
        .eq('tag_id', tagId)
        .order('tapped_at', { ascending: false })
        .limit(10) as any)

    // Get counts for different periods
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: todayCount } = await (supabase
        .from('tap_events')
        .select('*', { count: 'exact', head: true })
        .eq('tag_id', tagId)
        .gte('tapped_at', today.toISOString()) as any)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { count: weekCount } = await (supabase
        .from('tap_events')
        .select('*', { count: 'exact', head: true })
        .eq('tag_id', tagId)
        .gte('tapped_at', weekAgo.toISOString()) as any)

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href={`/dashboard/tags/${tagId}`} className="text-stone-500 hover:text-stone-700 text-sm transition-colors">
                    ← Back to Tag Editor
                </Link>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-stone-900">
                        {tag.label || tag.code} Analytics
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Track performance and insights for this tag
                    </p>
                </div>
                <Link
                    href="/dashboard/analytics"
                    className="text-stone-500 hover:text-stone-700 text-sm"
                >
                    View All Analytics →
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Taps" value={tag.tap_count} icon="📊" />
                <StatCard label="Today" value={todayCount || 0} icon="📅" />
                <StatCard label="This Week" value={weekCount || 0} icon="📈" />
            </div>

            {/* Tap Chart */}
            <div className="mb-6">
                <TapChart data={chartData} days={7} />
            </div>

            {/* Recent Taps */}
            <RecentTaps taps={(recentTaps || []) as TapEvent[]} />
        </div>
    )
}
