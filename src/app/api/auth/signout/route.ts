import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const signOutAndRedirect = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()

    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), {
        status: 302,
    })
}

export async function POST() {
    return signOutAndRedirect()
}

export async function GET() {
    return signOutAndRedirect()
}
