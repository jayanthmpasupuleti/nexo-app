interface StatCardProps {
    label: string
    value: string | number
    icon?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export default function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
    return (
        <div className={`bg-white rounded-xl border border-stone-200 p-5 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-stone-500 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-semibold text-stone-900">{value}</p>
                </div>
                {icon && (
                    <span className="text-2xl">{icon}</span>
                )}
            </div>

            {trend && (
                <div className={`mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
                </div>
            )}
        </div>
    )
}
