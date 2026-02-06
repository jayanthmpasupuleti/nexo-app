import { customAlphabet } from 'nanoid'

// Use URL-safe characters that are easy to type and read
// Excludes confusing characters like 0/O, 1/l/I
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

// Generate 8-character codes
// 32^8 = 1,099,511,627,776 possible combinations
const nanoid = customAlphabet(alphabet, 8)

/**
 * Generate a unique tag code for NFC URLs
 * Example: "ABC123XY"
 */
export function generateTagCode(): string {
    return nanoid()
}

/**
 * Validate a tag code format
 */
export function isValidTagCode(code: string): boolean {
    return /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(code)
}

/**
 * Get the full URL for a tag
 */
export function getTagUrl(code: string): string {
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'
    const protocol = domain.includes('localhost') ? 'http' : 'https'
    return `${protocol}://${domain}/t/${code}`
}
