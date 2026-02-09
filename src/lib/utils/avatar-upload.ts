import { createClient } from '@/lib/supabase/client'

/**
 * Upload an avatar image to Supabase Storage
 * @param file - The image file to upload
 * @param tagId - The tag ID to associate the avatar with
 * @returns The public URL of the uploaded avatar, or null on error
 */
export async function uploadAvatar(file: File, tagId: string): Promise<{ url: string | null; error: string | null }> {
    const supabase = createClient()

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
        return { url: null, error: 'Please upload a JPEG, PNG, WebP, or GIF image.' }
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
        return { url: null, error: 'Image must be smaller than 2MB.' }
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${tagId}-${Date.now()}.${fileExt}`
    const filePath = `business-cards/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        })

    if (uploadError) {
        console.error('Avatar upload error:', uploadError)
        return { url: null, error: 'Failed to upload image. Please try again.' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
}

/**
 * Delete an avatar from Supabase Storage
 * @param avatarUrl - The full URL of the avatar to delete
 */
export async function deleteAvatar(avatarUrl: string): Promise<{ error: string | null }> {
    const supabase = createClient()

    // Extract file path from URL
    const urlParts = avatarUrl.split('/avatars/')
    if (urlParts.length < 2) {
        return { error: 'Invalid avatar URL' }
    }
    const filePath = urlParts[1]

    const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath])

    if (error) {
        console.error('Avatar delete error:', error)
        return { error: 'Failed to delete avatar.' }
    }

    return { error: null }
}
