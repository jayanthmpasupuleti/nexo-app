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
            <div className="mb-8">
                <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Tag Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {tag.label || 'Untitled Tag'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {tag.tap_count} taps
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${tag.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}>
                        {tag.is_active ? 'Active' : 'Inactive'}
                    </div>
                </div>

                {/* Tag URL */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Tag URL</p>
                        <p className="font-mono text-gray-900">{tagUrl}</p>
                    </div>
                    <a
                        href={tagUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
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
