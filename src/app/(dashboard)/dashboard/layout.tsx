import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Profile } from '@/lib/types/database'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single() as { data: Profile | null }

    // Get initials for fallback avatar
    const getInitials = (name: string | null | undefined) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white border-b-2 border-black">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-black">
                                ✨ Nexo
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Profile Pill */}
                            <div className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border-2 border-black/10 bg-white hover:bg-gray-50 transition-colors">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-[var(--golden)] flex items-center justify-center text-sm font-bold text-black overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt={profile.full_name || 'Profile'}
                                            width={32}
                                            height={32}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span>{getInitials(profile?.full_name)}</span>
                                    )}
                                </div>

                                {/* Name */}
                                <span className="text-black font-semibold text-sm">
                                    {profile?.full_name || 'User'}
                                </span>
                            </div>

                            {/* Sign Out - Subtle */}
                            <form action="/api/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="px-3 py-2 text-black/40 hover:text-black text-sm font-medium transition-colors"
                                >
                                    ↪
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}
