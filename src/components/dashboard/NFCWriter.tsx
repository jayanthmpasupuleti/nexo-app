'use client'

import { useState, useEffect } from 'react'
import { checkNFCSupport, writeNFCTag, type NFCSupport } from '@/lib/utils/nfc'

interface NFCWriterProps {
    tagUrl: string
}

type WriteState = 'idle' | 'ready' | 'writing' | 'success' | 'error'

export default function NFCWriter({ tagUrl }: NFCWriterProps) {
    const [nfcSupport, setNfcSupport] = useState<NFCSupport | null>(null)
    const [writeState, setWriteState] = useState<WriteState>('idle')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setNfcSupport(checkNFCSupport())
    }, [])

    const handleWriteNFC = async () => {
        if (writeState === 'writing') return

        setWriteState('ready')
        setErrorMessage('')

        // Small delay to show "Hold tag near phone" message
        await new Promise(resolve => setTimeout(resolve, 100))
        setWriteState('writing')

        const result = await writeNFCTag(tagUrl)

        if (result.success) {
            setWriteState('success')
            setTimeout(() => setWriteState('idle'), 3000)
        } else {
            setWriteState('error')
            setErrorMessage(result.error || 'Failed to write to NFC tag')
        }
    }

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(tagUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleRetry = () => {
        setWriteState('idle')
        setErrorMessage('')
    }

    // Loading state
    if (nfcSupport === null) {
        return (
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
                <div className="animate-pulse h-20 bg-stone-100 rounded-lg" />
            </div>
        )
    }

    // NFC Supported - Show write button
    if (nfcSupport.supported) {
        return (
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
                <h3 className="font-medium text-stone-900 mb-2">📱 Write to NFC Tag</h3>
                <p className="text-stone-500 text-sm mb-4">
                    Program a physical NFC tag with this URL
                </p>

                {writeState === 'idle' && (
                    <button
                        onClick={handleWriteNFC}
                        className="w-full py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
                    >
                        Write to NFC Tag
                    </button>
                )}

                {writeState === 'ready' && (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-2">📲</div>
                        <p className="text-stone-900 font-medium">Hold your NFC tag near the phone...</p>
                    </div>
                )}

                {writeState === 'writing' && (
                    <div className="text-center py-4">
                        <div className="w-8 h-8 mx-auto mb-3 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
                        <p className="text-stone-600">Writing to tag...</p>
                    </div>
                )}

                {writeState === 'success' && (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-green-600 font-medium">NFC tag programmed successfully!</p>
                        <p className="text-stone-500 text-sm mt-1">Your tag is ready to use</p>
                    </div>
                )}

                {writeState === 'error' && (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-2">❌</div>
                        <p className="text-red-600 font-medium mb-2">{errorMessage}</p>
                        <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-300 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        )
    }

    // NFC Not Supported - Show alternative options
    return (
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
            <h3 className="font-medium text-stone-900 mb-2">📱 Program NFC Tag</h3>

            {/* iOS or unsupported browser message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> {nfcSupport.reason}
                </p>
            </div>

            {/* Manual instructions */}
            <div className="space-y-4">
                <div>
                    <p className="text-stone-600 text-sm mb-3">
                        To program your NFC tag, use a free app like <strong>NFC Tools</strong>:
                    </p>
                    <ol className="text-stone-600 text-sm space-y-2 ml-4 list-decimal">
                        <li>Download <strong>NFC Tools</strong> from App Store / Play Store</li>
                        <li>Open the app → Go to <strong>Write</strong> tab</li>
                        <li>Add a <strong>URL</strong> record with this link:</li>
                    </ol>
                </div>

                {/* URL to copy */}
                <div className="bg-white rounded-lg border border-stone-200 p-3">
                    <p className="font-mono text-sm text-stone-900 break-all mb-2">{tagUrl}</p>
                    <button
                        onClick={handleCopyUrl}
                        className="w-full py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                    >
                        {copied ? '✓ Copied!' : 'Copy URL'}
                    </button>
                </div>

                <ol start={4} className="text-stone-600 text-sm space-y-2 ml-4 list-decimal">
                    <li>Tap <strong>Write</strong> and hold your phone near the NFC tag</li>
                    <li>Done! Your tag is ready to use</li>
                </ol>
            </div>
        </div>
    )
}
