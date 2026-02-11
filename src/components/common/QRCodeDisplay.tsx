'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import QRCode from 'react-qr-code'
import { LuDownload, LuX } from 'react-icons/lu'

interface QRCodeDisplayProps {
    url: string
    onClose: () => void
}

export default function QRCodeDisplay({ url, onClose }: QRCodeDisplayProps) {
    const svgRef = useRef<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    const downloadQRCode = () => {
        const svg = svgRef.current
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width + 40 // Add padding
            canvas.height = img.height + 40
            if (ctx) {
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 20, 20)
                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = 'nexo-qr-code.png'
                downloadLink.href = pngFile
                downloadLink.click()
            }
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    if (!mounted) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl border-2 border-black p-6 shadow-[8px_8px_0_#000] relative max-w-sm w-full animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <LuX className="text-xl" />
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black mb-1">Scan to Connect</h3>
                    <p className="text-black/60 text-sm">Use your camera to open this link</p>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-black inline-block mb-6 mx-auto w-full flex justify-center">
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={url}
                            viewBox={`0 0 256 256`}
                            ref={svgRef as any}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={downloadQRCode}
                        className="btn-primary w-full justify-center"
                    >
                        <LuDownload className="text-lg" />
                        <span>Download QR Code</span>
                    </button>
                    <p className="text-xs text-center text-black/40">
                        Perfect for printing on flyers or business cards
                    </p>
                </div>
            </div>
        </div>,
        document.body
    )
}
