'use client'

import { useState, useEffect } from 'react'
import { checkNFCSupport, writeNFCTag, type NFCSupport } from '@/lib/utils/nfc'
import {
    LuSmartphone,
    LuNfc,
    LuCheck,
    LuX,
    LuCopy,
    LuCircleAlert,
    LuLoader
} from 'react-icons/lu'

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
            <div className="shadow-blue p-6">
                <div className="animate-pulse h-20 bg-[var(--blue)]/20 rounded-lg" />
            </div>
        )
    }

    // NFC Supported - Show write button
    if (nfcSupport.supported) {
        return (
            <div className="shadow-blue p-6">
                <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[var(--blue)] rounded-lg border-2 border-black flex items-center justify-center">
                        <LuNfc className="text-black" />
                    </span>
                    Write to NFC Tag
                </h3>
                <p className="text-black/60 text-sm mb-4">
                    Program a physical NFC tag with this URL
                </p>

                {writeState === 'idle' && (
                    <button
                        onClick={handleWriteNFC}
                        className="btn-primary w-full"
                    >
                        Write to NFC Tag
                    </button>
                )}

                {writeState === 'ready' && (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 bg-[var(--golden)] rounded-xl border-2 border-black flex items-center justify-center text-xl mx-auto mb-3">
                            <LuSmartphone className="text-black" />
                        </div>
                        <p className="text-black font-bold">Hold your NFC tag near the phone...</p>
                    </div>
                )}

                {writeState === 'writing' && (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 bg-[var(--blue)] rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-3">
                            <LuLoader className="text-black animate-spin" />
                        </div>
                        <p className="text-black/60">Writing to tag...</p>
                    </div>
                )}

                {writeState === 'success' && (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-400 rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-3">
                            <LuCheck className="text-black text-xl" />
                        </div>
                        <p className="text-green-700 font-bold">NFC tag programmed successfully!</p>
                        <p className="text-black/60 text-sm mt-1">Your tag is ready to use</p>
                    </div>
                )}

                {writeState === 'error' && (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 bg-red-400 rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-3">
                            <LuX className="text-black text-xl" />
                        </div>
                        <p className="text-red-600 font-bold mb-2">{errorMessage}</p>
                        <button
                            onClick={handleRetry}
                            className="btn-secondary text-sm"
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
        <div className="shadow-blue p-6">
            <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-[var(--blue)] rounded-lg border-2 border-black flex items-center justify-center">
                    <LuNfc className="text-black" />
                </span>
                Program NFC Tag
            </h3>

            {/* iOS or unsupported browser message */}
            <div className="bg-[var(--golden-light)] border-2 border-[var(--golden)] rounded-lg p-4 mb-4 flex items-start gap-3">
                <LuCircleAlert className="text-[var(--golden)] text-lg flex-shrink-0 mt-0.5" />
                <p className="text-black text-sm">
                    <strong>Note:</strong> {nfcSupport.reason}
                </p>
            </div>

            {/* Manual instructions */}
            <div className="space-y-4">
                <div>
                    <p className="text-black/80 text-sm mb-3">
                        To program your NFC tag, use a free app like <strong>NFC Tools</strong>:
                    </p>
                    <ol className="text-black/70 text-sm space-y-2 ml-4 list-decimal">
                        <li>Download <strong>NFC Tools</strong> from App Store / Play Store</li>
                        <li>Open the app → Go to <strong>Write</strong> tab</li>
                        <li>Add a <strong>URL</strong> record with this link:</li>
                    </ol>
                </div>

                {/* URL to copy */}
                <div className="bg-white rounded-lg border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                    <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-black break-all flex-1">{tagUrl}</p>
                        <button
                            onClick={handleCopyUrl}
                            className="px-3 py-1.5 bg-[var(--golden)] text-black rounded-lg text-sm font-bold border-2 border-black hover:bg-[var(--golden-light)] transition-colors inline-flex items-center gap-1.5 flex-shrink-0"
                            style={{ boxShadow: '2px 2px 0 #000' }}
                        >
                            {copied ? <><LuCheck /> Copied</> : <><LuCopy /> Copy</>}
                        </button>
                    </div>
                </div>

                <ol start={4} className="text-black/70 text-sm space-y-2 ml-4 list-decimal">
                    <li>Tap <strong>Write</strong> and hold your phone near the NFC tag</li>
                    <li>Done! Your tag is ready to use</li>
                </ol>
            </div>
        </div>
    )
}
