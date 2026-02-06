import type { WifiSecurity } from '@/lib/types/database'

interface WifiQRParams {
    ssid: string
    password: string
    security: WifiSecurity
    hidden?: boolean
}

/**
 * Generate Wi-Fi connection string for QR codes
 * Format: WIFI:T:WPA;S:network;P:password;H:false;;
 */
export function generateWifiString(params: WifiQRParams): string {
    const { ssid, password, security, hidden = false } = params

    // Escape special characters
    const escapeWifi = (str: string) =>
        str.replace(/[\\;,:]/g, (char) => `\\${char}`)

    const parts = [
        'WIFI:',
        `T:${security === 'nopass' ? 'nopass' : security};`,
        `S:${escapeWifi(ssid)};`,
    ]

    if (security !== 'nopass') {
        parts.push(`P:${escapeWifi(password)};`)
    }

    parts.push(`H:${hidden};;`)

    return parts.join('')
}

/**
 * Get QR code data URL using a third-party service
 * For production, consider self-hosting or using a library like qrcode
 */
export function getWifiQRUrl(params: WifiQRParams, size = 300): string {
    const wifiString = generateWifiString(params)
    const encoded = encodeURIComponent(wifiString)

    // Using QR Server API (free, no API key needed)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`
}
