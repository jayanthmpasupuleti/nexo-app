/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import BusinessCard from '@/components/modes/BusinessCard'
import WiFiShare from '@/components/modes/WiFiShare'
import LinkHub from '@/components/modes/LinkHub'
import EmergencyInfo from '@/components/modes/EmergencyInfo'
import type { TagWithData } from '@/lib/types/database'

interface TagPageProps {
    params: Promise<{ code: string }>
}

export default async function TagPage({ params }: TagPageProps) {
    const { code } = await params
    const supabase = await createClient()

    // Fetch the tag with its mode data
    const { data: tag, error } = await supabase
        .from('tags')
        .select(`
      *,
      business_cards (*),
      wifi_configs (*),
      link_hubs (*),
      emergency_infos (*),
      custom_redirects (*)
    `)
        .eq('code', code)
        .eq('is_active', true)
        .single() as { data: TagWithData | null, error: unknown }

    if (error || !tag) {
        notFound()
    }

    // Record tap event and increment tap count (fire-and-forget)
    ; (async () => {
        // Insert tap event for analytics
        await (supabase.from('tap_events') as any).insert({
            tag_id: tag.id
        })

        // Also update the quick-access tap count
        await (supabase.from('tags') as any)
            .update({ tap_count: tag.tap_count + 1 })
            .eq('id', tag.id)
    })()


    // Render based on active mode
    switch (tag.active_mode) {
        case 'business_card':
            if (!tag.business_cards) {
                return <EmptyModeMessage mode="Business Card" />
            }
            return <BusinessCard data={tag.business_cards} />

        case 'wifi':
            if (!tag.wifi_configs) {
                return <EmptyModeMessage mode="Wi-Fi" />
            }
            return <WiFiShare data={tag.wifi_configs} />

        case 'link_hub':
            if (!tag.link_hubs) {
                return <EmptyModeMessage mode="Link Hub" />
            }
            return <LinkHub data={tag.link_hubs} />

        case 'emergency':
            if (!tag.emergency_infos) {
                return <EmptyModeMessage mode="Emergency Info" />
            }
            return <EmergencyInfo data={tag.emergency_infos} />

        case 'redirect':
            if (!tag.custom_redirects?.url) {
                return <EmptyModeMessage mode="Redirect" />
            }
            redirect(tag.custom_redirects.url)

        default:
            notFound()
    }
}

function EmptyModeMessage({ mode }: { mode: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
            <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                    <span className="text-2xl">🔧</span>
                </div>
                <h1 className="text-lg font-semibold text-stone-900 mb-2">
                    {mode} Not Configured
                </h1>
                <p className="text-stone-500 text-sm">
                    The owner hasn&apos;t set up this mode yet.
                </p>
            </div>
        </div>
    )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TagPageProps) {
    const { code } = await params

    return {
        title: `Nexo Tag | ${code}`,
        description: 'Tap to connect',
        robots: 'noindex', // Don't index individual tag pages
    }
}
