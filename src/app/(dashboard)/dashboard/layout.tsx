import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
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

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-stone-200">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex justify-between h-14">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-semibold text-stone-900">
                                Nexo
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-stone-500 text-sm">
                                {profile?.full_name || user.email}
                            </span>
                            <form action="/api/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="text-stone-400 hover:text-stone-600 text-sm transition-colors"
                                >
                                    Sign out
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
