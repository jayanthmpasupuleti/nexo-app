import type { TapEvent } from '@/lib/types/database'

interface RecentTapsProps {
    taps: TapEvent[]
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

    return tapDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })
}

export default function RecentTaps({ taps }: RecentTapsProps) {
    if (taps.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-medium text-stone-900 mb-4">Recent Taps</h3>
                <p className="text-stone-500 text-sm">No taps recorded yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-medium text-stone-900 mb-4">Recent Taps</h3>

            <div className="space-y-3">
                {taps.map(tap => (
                    <div key={tap.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                <span className="text-sm">📱</span>
                            </div>
                            <span className="text-stone-600 text-sm">Tag scanned</span>
                        </div>
                        <span className="text-stone-400 text-sm">{getRelativeTime(tap.tapped_at)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
