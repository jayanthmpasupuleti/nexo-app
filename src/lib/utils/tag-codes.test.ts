import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { generateTagCode, isValidTagCode, getTagUrl } from './tag-codes'

describe('Tag Code Utilities', () => {
    describe('generateTagCode', () => {
        it('should generate a code of length 8', () => {
            const code = generateTagCode()
            expect(code).toHaveLength(8)
        })

        it('should generate unique codes', () => {
            const code1 = generateTagCode()
            const code2 = generateTagCode()
            expect(code1).not.toBe(code2)
        })

        it('should use valid characters', () => {
            const code = generateTagCode()
            // Alphabet: 23456789ABCDEFGHJKLMNPQRSTUVWXYZ
            expect(code).toMatch(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]+$/)
        })
    })

    describe('isValidTagCode', () => {
        it('should return true for valid codes', () => {
            expect(isValidTagCode('ABC234XY')).toBe(true)
            expect(isValidTagCode('23456789')).toBe(true)
        })

        it('should return false for invalid length', () => {
            expect(isValidTagCode('ABC')).toBe(false)
            expect(isValidTagCode('ABC123XYZ')).toBe(false)
        })

        it('should return false for invalid characters', () => {
            expect(isValidTagCode('ABC123O0')).toBe(false) // 0 and O are excluded
            expect(isValidTagCode('ABC123I1')).toBe(false) // 1 and I are excluded
            expect(isValidTagCode('abc123xy')).toBe(false) // Lowercase not allowed
        })
    })

    describe('getTagUrl', () => {
        // Mock process.env
        const originalEnv = process.env

        beforeEach(() => {
            vi.resetModules()
            process.env = { ...originalEnv }
        })

        afterAll(() => {
            process.env = originalEnv
        })

        it('should use NEXT_PUBLIC_APP_URL when available', () => {
            process.env.NEXT_PUBLIC_APP_URL = 'https://nexo.app'
            const url = getTagUrl('CODE1234')
            expect(url).toBe('https://nexo.app/t/CODE1234')
        })

        it('should fallback to localhost if env var is missing', () => {
            delete process.env.NEXT_PUBLIC_APP_URL
            const url = getTagUrl('CODE1234')
            expect(url).toBe('http://localhost:3000/t/CODE1234')
        })
    })
})
