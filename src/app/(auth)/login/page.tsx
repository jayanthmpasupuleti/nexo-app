'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push('/dashboard')
        router.refresh()
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

                {/* Login Form */}
                <form onSubmit={handleLogin} className="shadow-golden p-8">
                    <h2 className="text-xl font-bold text-black mb-6">Welcome back 👋</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border-2 border-black rounded-lg text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
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
                                className="input-sketchy w-full"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>

                    <p className="mt-6 text-center text-black/60 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-black font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
