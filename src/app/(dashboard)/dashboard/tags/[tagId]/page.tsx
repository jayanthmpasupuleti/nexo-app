import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTagUrl } from '@/lib/utils/tag-codes'
import TagEditor from '@/components/dashboard/TagEditor'
import TagUrlSection from '@/components/dashboard/TagUrlSection'
import NFCWriter from '@/components/dashboard/NFCWriter'
import type { TagWithData } from '@/lib/types/database'
import { LuArrowLeft, LuChartBar, LuCheck } from 'react-icons/lu'


interface TagEditorPageProps {
    params: Promise<{ tagId: string }>
}

export default async function TagEditorPage({ params }: TagEditorPageProps) {
    const { tagId } = await params
    const supabase = await createClient()

    // Fetch tag with all mode data
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
        .eq('id', tagId)
        .single() as { data: TagWithData | null, error: unknown }

    if (error || !tag) {
        notFound()
    }

    const tagUrl = getTagUrl(tag.code)

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-black/60 hover:text-black text-sm font-medium transition-colors">
                    <LuArrowLeft /> Back to Dashboard
                </Link>
            </div>

            {/* Tag Header */}
            <div className="shadow-golden p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-black">
                            {tag.label || 'Untitled Tag'}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-black/60 text-sm font-medium">
                                {tag.tap_count} taps
                            </p>
                            <Link
                                href={`/dashboard/tags/${tag.id}/analytics`}
                                className="badge-blue text-xs inline-flex items-center gap-1"
                            >
                                <LuChartBar /> View Analytics
                            </Link>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-black flex items-center gap-1 ${tag.is_active
                        ? 'bg-green-200 text-black'
                        : 'bg-gray-200 text-black'
                        }`}>
                        {tag.is_active && <LuCheck />}
                        {tag.is_active ? 'Active' : 'Inactive'}
                    </div>
                </div>

                {/* Tag URL */}
                <TagUrlSection tagUrl={tagUrl} tagCode={tag.code} />
            </div>


            {/* NFC Writer */}
            <div className="mb-6">
                <NFCWriter tagUrl={tagUrl} />
            </div>

            {/* Mode Editor */}
            <TagEditor tag={tag} />
        </div>
    )
}
