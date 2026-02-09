'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md shadow-blue p-8 text-center">
                    <div className="text-5xl mb-4">✉️</div>
                    <h2 className="text-xl font-bold text-black mb-3">Check your email</h2>
                    <p className="text-black/60 mb-6">
                        We&apos;ve sent a confirmation link to <strong className="text-black">{email}</strong>
                    </p>
                    <Link href="/login" className="btn-primary">
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-2xl font-bold text-black">✨ Nexo</h1>
                        <p className="text-black/60 mt-1">Your digital identity, one tap away</p>
                    </Link>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="shadow-blue p-8">
                    <h2 className="text-xl font-bold text-black mb-6">Create an account ✨</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border-2 border-black rounded-lg text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-black font-medium text-sm mb-2">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="input-sketchy w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-black font-medium text-sm mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="input-sketchy w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-black font-medium text-sm mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="input-sketchy w-full"
                            />
                            <p className="text-black/40 text-xs mt-1">Minimum 6 characters</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create Account →'}
                    </button>

                    <p className="mt-6 text-center text-black/60 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-black font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
