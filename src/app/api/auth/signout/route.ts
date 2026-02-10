import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function handleSignOut(request: NextRequest) {
    try {
        const supabase = await createClient()
        await supabase.auth.signOut()
    } catch (e) {
        console.error('Sign out error:', e)
    }

    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(`${baseUrl}/login`, { status: 302 })
}

export async function POST(request: NextRequest) {
    return handleSignOut(request)
}

export async function GET(request: NextRequest) {
    return handleSignOut(request)
}
