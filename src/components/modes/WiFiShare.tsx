'use client'

import { useState } from 'react'
import type { WifiConfig } from '@/lib/types/database'
import { getWifiQRUrl } from '@/lib/utils/wifi-qr'

interface WiFiShareProps {
    data: WifiConfig
}

export default function WiFiShare({ data }: WiFiShareProps) {
    const [copied, setCopied] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const qrCodeUrl = getWifiQRUrl({
        ssid: data.ssid,
        password: data.password || '',
        security: data.security
    })

    const handleCopyPassword = async () => {
        if (data.password) {
            await navigator.clipboard.writeText(data.password)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
            {/* Animated wave patterns */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse delay-500" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-1000" />
            </div>

            {/* Background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col items-center">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">📶</span>
                    <span className="text-white/60 text-sm font-medium tracking-wider uppercase">Nexo Wi-Fi</span>
                </div>

                {/* Network Name */}
                <h1 className="text-2xl font-bold text-white mb-2 text-center">
                    {data.ssid || 'Network Name'}
                </h1>
                <p className="text-blue-300 text-sm mb-8">Scan to Connect</p>

                {/* QR Code */}
                <div className="bg-white rounded-3xl p-4 mb-8 shadow-2xl shadow-blue-500/20">
                    <img
                        src={qrCodeUrl}
                        alt={`WiFi QR code for ${data.ssid}`}
                        className="w-48 h-48 rounded-2xl"
                    />
                </div>

                {/* Network Details Card */}
                <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                        <span className="text-white/60 text-sm">Network</span>
                        <span className="text-white font-medium">{data.ssid}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                        <span className="text-white/60 text-sm">Security</span>
                        <span className="text-white font-medium">{data.security || 'WPA2'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Password</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-mono">
                                {showPassword ? data.password : '••••••••'}
                            </span>
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copy Password Button */}
                <button
                    onClick={handleCopyPassword}
                    className="w-full py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all mb-4 flex items-center justify-center gap-2"
                >
                    <span>📋</span>
                    <span>{copied ? 'Copied!' : 'Copy Password'}</span>
                </button>

                {/* Connect Automatically Button */}
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/25">
                    ⚡ Connect Automatically
                </button>

                {/* Powered by */}
                <p className="text-white/30 text-xs mt-8">Powered by Nexo</p>
            </div>
        </div>
    )
}
