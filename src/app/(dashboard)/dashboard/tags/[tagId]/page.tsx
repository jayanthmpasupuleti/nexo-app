import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTagUrl } from '@/lib/utils/tag-codes'
import TagEditor from '@/components/dashboard/TagEditor'
import type { TagWithData } from '@/lib/types/database'

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
                <Link href="/dashboard" className="text-stone-500 hover:text-stone-700 text-sm transition-colors">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Tag Header */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-semibold text-stone-900">
                            {tag.label || 'Untitled Tag'}
                        </h1>
                        <p className="text-stone-500 text-sm mt-1">
                            {tag.tap_count} taps
                        </p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${tag.is_active
                        ? 'bg-green-50 text-green-600'
                        : 'bg-stone-100 text-stone-500'
                        }`}>
                        {tag.is_active ? 'Active' : 'Inactive'}
                    </div>
                </div>

                {/* Tag URL */}
                <div className="bg-stone-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <p className="text-stone-400 text-xs mb-1">Tag URL</p>
                        <p className="font-mono text-stone-900 text-sm">{tagUrl}</p>
                    </div>
                    <a
                        href={tagUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                    >
                        Preview
                    </a>
                </div>
            </div>

            {/* Mode Editor */}
            <TagEditor tag={tag} />
        </div>
    )
}
