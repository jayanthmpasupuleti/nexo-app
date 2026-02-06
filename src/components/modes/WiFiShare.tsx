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
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-stone-500 text-sm mb-4">
                        <span>📶</span>
                        <span>Wi-Fi</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-stone-900">
                        {data.ssid || 'Network Name'}
                    </h1>
                    <p className="text-stone-500 mt-1">Scan to connect</p>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white border border-stone-100 rounded-lg">
                            <img
                                src={qrCodeUrl}
                                alt={`WiFi QR code for ${data.ssid}`}
                                className="w-44 h-44"
                            />
                        </div>
                    </div>

                    <p className="text-center text-stone-500 text-sm">
                        Point your camera at the QR code to connect
                    </p>
                </div>

                {/* Network Details */}
                <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 mb-6">
                    <div className="flex items-center justify-between px-4 py-3.5">
                        <span className="text-stone-500 text-sm">Network</span>
                        <span className="text-stone-900 font-medium">{data.ssid}</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3.5">
                        <span className="text-stone-500 text-sm">Security</span>
                        <span className="text-stone-900">{data.security || 'WPA2'}</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3.5">
                        <span className="text-stone-500 text-sm">Password</span>
                        <div className="flex items-center gap-2">
                            <span className="text-stone-900 font-mono text-sm">
                                {showPassword ? data.password : '••••••••'}
                            </span>
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copy Password Button */}
                <button
                    onClick={handleCopyPassword}
                    className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy Password'}
                </button>

                {/* Footer */}
                <p className="text-center text-stone-400 text-xs mt-8">
                    Powered by Nexo
                </p>
            </div>
        </div>
    )
}
