/**
 * Web NFC API utility for writing URLs to NFC tags
 * Only supported on Android Chrome 89+
 */

export interface NFCWriteResult {
    success: boolean
    error?: string
}

export interface NFCSupport {
    supported: boolean
    reason?: string
}

/**
 * Check if Web NFC API is supported in the current browser
 */
export function checkNFCSupport(): NFCSupport {
    // Check if running in a secure context (HTTPS or localhost)
    if (typeof window === 'undefined') {
        return { supported: false, reason: 'Server-side rendering' }
    }

    if (!window.isSecureContext) {
        return { supported: false, reason: 'NFC requires HTTPS' }
    }

    // Check if NDEFReader is available (Web NFC API)
    if (!('NDEFReader' in window)) {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (isIOS) {
            return { supported: false, reason: 'iOS does not support Web NFC. Use an NFC writing app like NFC Tools.' }
        }

        // Detect non-Chrome Android or desktop
        const isAndroid = /Android/.test(navigator.userAgent)
        const isChrome = /Chrome/.test(navigator.userAgent)

        if (isAndroid && !isChrome) {
            return { supported: false, reason: 'Please use Chrome browser for NFC writing.' }
        }

        return { supported: false, reason: 'Your browser does not support NFC. Use Chrome on Android.' }
    }

    return { supported: true }
}

/**
 * Write a URL to an NFC tag using Web NFC API
 */
export async function writeNFCTag(url: string): Promise<NFCWriteResult> {
    const support = checkNFCSupport()
    if (!support.supported) {
        return { success: false, error: support.reason }
    }

    try {
        // @ts-expect-error - NDEFReader is not in TypeScript's lib yet
        const ndef = new NDEFReader()

        // Request permission and prepare to write
        await ndef.write({
            records: [
                {
                    recordType: 'url',
                    data: url
                }
            ]
        })

        return { success: true }
    } catch (error) {
        const err = error as Error

        // Handle specific error cases
        if (err.name === 'NotAllowedError') {
            return { success: false, error: 'NFC permission denied. Please allow NFC access.' }
        }

        if (err.name === 'NotSupportedError') {
            return { success: false, error: 'NFC is not available on this device.' }
        }

        if (err.name === 'NotReadableError') {
            return { success: false, error: 'Could not read NFC tag. Make sure the tag is nearby.' }
        }

        if (err.name === 'NetworkError') {
            return { success: false, error: 'NFC transfer failed. Try holding the tag steady.' }
        }

        if (err.name === 'AbortError') {
            return { success: false, error: 'NFC operation was cancelled.' }
        }

        return { success: false, error: err.message || 'Failed to write to NFC tag.' }
    }
}

/**
 * Scan for NFC tag (for testing/reading)
 */
export async function scanNFCTag(): Promise<{ url?: string; error?: string }> {
    const support = checkNFCSupport()
    if (!support.supported) {
        return { error: support.reason }
    }

    try {
        // @ts-expect-error - NDEFReader is not in TypeScript's lib yet
        const ndef = new NDEFReader()
        await ndef.scan()

        return new Promise((resolve) => {
            ndef.onreading = (event: { message: { records: Array<{ recordType: string; data: ArrayBuffer }> } }) => {
                for (const record of event.message.records) {
                    if (record.recordType === 'url') {
                        const decoder = new TextDecoder()
                        const url = decoder.decode(record.data)
                        resolve({ url })
                        return
                    }
                }
                resolve({ error: 'No URL found on this NFC tag.' })
            }

            ndef.onreadingerror = () => {
                resolve({ error: 'Error reading NFC tag.' })
            }
        })
    } catch (error) {
        const err = error as Error
        return { error: err.message || 'Failed to scan NFC tag.' }
    }
}
