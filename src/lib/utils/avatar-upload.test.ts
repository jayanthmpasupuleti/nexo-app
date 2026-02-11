import { vi, describe, it, expect, beforeEach } from 'vitest'
import { uploadAvatar, deleteAvatar } from './avatar-upload'

// Mock createClient
const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockRemove = vi.fn()
const mockFrom = vi.fn(() => ({
    upload: mockUpload,
    getPublicUrl: mockGetPublicUrl,
    remove: mockRemove,
}))

vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        storage: {
            from: mockFrom,
        },
    })),
}))

describe('avatar-upload', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('uploadAvatar', () => {
        const createMockFile = (name: string, type: string, size: number) => {
            const file = new File(['mock content'], name, { type })
            Object.defineProperty(file, 'size', { value: size })
            return file
        }

        it('should validate file type', async () => {
            const file = createMockFile('test.pdf', 'application/pdf', 1000)
            const result = await uploadAvatar(file, 'tag-1')

            expect(result.error).toContain('Please upload a JPEG')
            expect(result.url).toBeNull()
            expect(mockUpload).not.toHaveBeenCalled()
        })

        it('should validate file size', async () => {
            // 3MB
            const file = createMockFile('test.jpg', 'image/jpeg', 3 * 1024 * 1024)
            const result = await uploadAvatar(file, 'tag-1')

            expect(result.error).toContain('Image must be smaller than 2MB')
            expect(result.url).toBeNull()
            expect(mockUpload).not.toHaveBeenCalled()
        })

        it('should handle upload error', async () => {
            mockUpload.mockResolvedValue({ error: new Error('Upload failed') })

            const file = createMockFile('test.jpg', 'image/jpeg', 1000)
            const result = await uploadAvatar(file, 'tag-1')

            expect(result.error).toContain('Failed to upload image')
            expect(result.url).toBeNull()
        })

        it('should return public URL on success', async () => {
            mockUpload.mockResolvedValue({ data: { path: 'path/to/file' }, error: null })
            mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/avatar.jpg' } })

            const file = createMockFile('test.jpg', 'image/jpeg', 1000)
            const result = await uploadAvatar(file, 'tag-1')

            expect(result.error).toBeNull()
            expect(result.url).toBe('https://example.com/avatar.jpg')
            expect(mockFrom).toHaveBeenCalledWith('avatars')
        })
    })

    describe('deleteAvatar', () => {
        it('should validate avatar URL', async () => {
            const result = await deleteAvatar('https://google.com/image.jpg')
            expect(result.error).toBe('Invalid avatar URL')
            expect(mockRemove).not.toHaveBeenCalled()
        })

        it('should handle remove error', async () => {
            mockRemove.mockResolvedValue({ error: new Error('Remove failed') })

            const result = await deleteAvatar('https://example.com/avatars/path/to/file.jpg')
            expect(result.error).toBe('Failed to delete avatar.')
        })

        it('should return null error on success', async () => {
            mockRemove.mockResolvedValue({ error: null })

            const result = await deleteAvatar('https://example.com/avatars/path/to/file.jpg')
            expect(result.error).toBeNull()
            expect(mockRemove).toHaveBeenCalledWith(['path/to/file.jpg'])
        })
    })
})
