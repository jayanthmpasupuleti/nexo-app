import { describe, it, expect } from 'vitest'
import { generateWifiString, getWifiQRUrl } from './wifi-qr'

describe('WiFi QR Utilities', () => {
    describe('generateWifiString', () => {
        it('should generate WPA string correctly', () => {
            const params = {
                ssid: 'MyNetwork',
                password: 'secretpassword',
                security: 'WPA' as const,
                hidden: false
            }
            const expected = 'WIFI:T:WPA;S:MyNetwork;P:secretpassword;H:false;;'
            expect(generateWifiString(params)).toBe(expected)
        })

        it('should generate WEP string correctly', () => {
            const params = {
                ssid: 'MyNetwork',
                password: 'secretpassword',
                security: 'WEP' as const,
                hidden: false
            }
            const expected = 'WIFI:T:WEP;S:MyNetwork;P:secretpassword;H:false;;'
            expect(generateWifiString(params)).toBe(expected)
        })

        it('should generate nopass string correctly', () => {
            const params = {
                ssid: 'FreeWifi',
                password: '',
                security: 'nopass' as const,
                hidden: false
            }
            // T:nopass;S:FreeWifi;H:false;; (no P: part)
            const expected = 'WIFI:T:nopass;S:FreeWifi;H:false;;'
            expect(generateWifiString(params)).toBe(expected)
        })

        it('should handle hidden networks', () => {
            const params = {
                ssid: 'HiddenNet',
                password: 'pass',
                security: 'WPA' as const,
                hidden: true
            }
            const expected = 'WIFI:T:WPA;S:HiddenNet;P:pass;H:true;;'
            expect(generateWifiString(params)).toBe(expected)
        })

        it('should escape special characters', () => {
            const params = {
                ssid: 'My;Network\\Name',
                password: 'pass:word,',
                security: 'WPA' as const,
            }
            // S:My\;Network\\Name; P:pass\:word\,;
            const expected = 'WIFI:T:WPA;S:My\\;Network\\\\Name;P:pass\\:word\\,;H:false;;'
            expect(generateWifiString(params)).toBe(expected)
        })
    })

    describe('getWifiQRUrl', () => {
        it('should generate correct QR Server URL', () => {
            const params = {
                ssid: 'MyNetwork',
                password: 'pass',
                security: 'WPA' as const,
            }
            // WIFI:T:WPA;S:MyNetwork;P:pass;H:false;;
            // encoded: WIFI%3AT%3AWPA%3BS%3AMyNetwork%3BP%3Apass%3BH%3Afalse%3B%3B
            const url = getWifiQRUrl(params)
            expect(url).toContain('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WIFI')
            expect(url).toContain(encodeURIComponent('WIFI:T:WPA;S:MyNetwork;P:pass;H:false;;'))
        })

        it('should support custom size', () => {
            const params = {
                ssid: 'Net',
                password: '',
                security: 'nopass' as const,
            }
            const url = getWifiQRUrl(params, 500)
            expect(url).toContain('size=500x500')
        })
    })
})
