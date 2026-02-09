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
        <div className="min-h-screen">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="badge-blue inline-flex items-center gap-2 px-4 py-2 mb-4">
                        <span>📶</span>
                        <span className="font-medium">Wi-Fi</span>
                    </div>
                    <h1 className="text-2xl font-bold text-black">
                        {data.ssid || 'Network Name'}
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Scan to connect</p>
                </div>

                {/* QR Code */}
                <div className="shadow-golden p-6 mb-6">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white border-2 border-black rounded-lg">
                            <img
                                src={qrCodeUrl}
                                alt={`WiFi QR code for ${data.ssid}`}
                                className="w-44 h-44"
                            />
                        </div>
                    </div>

                    <p className="text-center text-black/60 text-sm font-medium">
                        📱 Point your camera at the QR code to connect
                    </p>
                </div>

                {/* Network Details */}
                <div className="shadow-blue mb-6 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-4 border-b-2 border-black">
                        <span className="text-black/60 text-sm font-medium">Network</span>
                        <span className="text-black font-bold">{data.ssid}</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-4 border-b-2 border-black">
                        <span className="text-black/60 text-sm font-medium">Security</span>
                        <span className="badge-golden">{data.security || 'WPA2'}</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-4">
                        <span className="text-black/60 text-sm font-medium">Password</span>
                        <div className="flex items-center gap-2">
                            <span className="text-black font-mono text-sm font-bold">
                                {showPassword ? data.password : '••••••••'}
                            </span>
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center hover:bg-[var(--golden-light)] transition-colors"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copy Password Button */}
                <button
                    onClick={handleCopyPassword}
                    className="btn-primary w-full"
                >
                    {copied ? '✓ Copied!' : '📋 Copy Password'}
                </button>

                {/* Footer */}
                <p className="text-center text-black/40 text-xs mt-8 font-medium">
                    ✨ Powered by Nexo
                </p>
            </div>
        </div>
    )
}
