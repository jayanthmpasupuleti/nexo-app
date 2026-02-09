'use client'

import type { TapCountByDay } from '@/lib/types/database'

interface TapChartProps {
    data: TapCountByDay[]
    days?: number
}

export default function TapChart({ data, days = 7 }: TapChartProps) {
    // Generate all dates for the range (fill in gaps with 0)
    const today = new Date()
    const dateMap = new Map<string, number>()

    // Initialize all dates with 0
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        dateMap.set(dateStr, 0)
    }

    // Fill in actual data
    data.forEach(item => {
        dateMap.set(item.tap_date, item.tap_count)
    })

    // Convert to array
    const chartData = Array.from(dateMap.entries()).map(([date, count]) => ({
        date,
        count,
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    }))

    // Find max for scaling
    const maxCount = Math.max(...chartData.map(d => d.count), 1)

    return (
        <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-medium text-stone-900 mb-4">Taps Over Time</h3>

            <div className="flex items-end justify-between h-40 gap-2">
                {chartData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center justify-end h-32">
                            {/* Bar */}
                            <div
                                className="w-full max-w-8 bg-stone-900 rounded-t transition-all hover:bg-stone-700"
                                style={{
                                    height: `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 8 : 0)}%`,
                                    minHeight: item.count > 0 ? '8px' : '0'
                                }}
                            />
                        </div>

                        {/* Count label */}
                        <span className="text-xs text-stone-500 mt-1">{item.count}</span>

                        {/* Day label */}
                        <span className="text-xs text-stone-400 mt-0.5">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
