import React from 'react'

interface StatCardProps {
    label: string
    value: string | number
    icon?: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export default function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
    return (
        <div className={`shadow-golden p-5 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-black/60 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold text-black">{value}</p>
                </div>
                {icon && (
                    <div className="w-10 h-10 bg-[var(--golden)] rounded-lg border-2 border-black flex items-center justify-center text-lg text-black">
                        {icon}
                    </div>
                )}
            </div>

            {trend && (
                <div className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
                </div>
            )}
        </div>
    )
}
