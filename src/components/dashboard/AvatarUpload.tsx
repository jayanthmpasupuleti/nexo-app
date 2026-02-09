'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadAvatar, deleteAvatar } from '@/lib/utils/avatar-upload'
import { LuCamera, LuTrash2, LuCheck } from 'react-icons/lu'

interface AvatarUploadProps {
    currentAvatarUrl: string | null
    tagId: string
    businessCardId: string | null
    name: string
    onAvatarChange: (url: string | null) => void
}

export default function AvatarUpload({ currentAvatarUrl, tagId, businessCardId, name, onAvatarChange }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    // Use local state for immediate display updates
    const [displayUrl, setDisplayUrl] = useState<string | null>(currentAvatarUrl)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()
    const router = useRouter()

    // Sync displayUrl with prop when it changes (e.g., after page refresh)
    useEffect(() => {
        setDisplayUrl(currentAvatarUrl)
    }, [currentAvatarUrl])

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const saveAvatarToDatabase = async (url: string | null) => {
        if (businessCardId) {
            // Update existing business card
            const { error } = await (supabase.from('business_cards') as any)
                .update({ avatar_url: url })
                .eq('id', businessCardId)

            if (error) {
                console.error('Error saving avatar to database:', error)
                return false
            }
            return true
        }
        return false
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError(null)
        setSuccess(false)

        // Delete old avatar if exists
        if (displayUrl) {
            await deleteAvatar(displayUrl)
        }

        // Upload new avatar
        const { url, error: uploadError } = await uploadAvatar(file, tagId)

        if (uploadError) {
            setError(uploadError)
            setUploading(false)
            return
        }

        // Update display immediately
        setDisplayUrl(url)

        // Auto-save to database
        const saved = await saveAvatarToDatabase(url)

        // Update parent form state
        onAvatarChange(url)

        setUploading(false)

        if (saved) {
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
            // Refresh the page data to ensure consistency
            router.refresh()
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemove = async () => {
        if (!displayUrl) return

        setUploading(true)
        setError(null)
        setSuccess(false)

        await deleteAvatar(displayUrl)

        // Clear display immediately
        setDisplayUrl(null)

        // Auto-save removal to database
        await saveAvatarToDatabase(null)

        // Update parent form state
        onAvatarChange(null)

        setUploading(false)

        // Refresh the page data
        router.refresh()
    }

    return (
        <div className="mb-6">
            <label className="block text-black/60 text-sm mb-3">Profile Photo</label>

            <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[var(--golden-light)] flex items-center justify-center flex-shrink-0 border-2 border-black">
                    {displayUrl ? (
                        <Image
                            src={displayUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                            sizes="80px"
                            key={displayUrl} // Force re-render when URL changes
                        />
                    ) : (
                        <span className="text-2xl font-bold text-black/60">
                            {getInitials(name || 'U')}
                        </span>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg border-2 border-black hover:bg-black/80 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
                        style={{ boxShadow: '2px 2px 0 var(--golden)' }}
                    >
                        <LuCamera />
                        {displayUrl ? 'Change Photo' : 'Upload Photo'}
                    </button>

                    {displayUrl && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={uploading}
                            className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg border-2 border-black hover:bg-gray-50 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
                            style={{ boxShadow: '2px 2px 0 #000' }}
                        >
                            <LuTrash2 />
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <LuCheck /> Photo saved!
                </p>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            {/* Helper Text */}
            <p className="mt-2 text-xs text-black/40">
                JPEG, PNG, WebP, or GIF. Max 2MB.
            </p>
        </div>
    )
}
