import Link from 'next/link'

export default function TagNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
            <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                </div>
                <h1 className="text-lg font-semibold text-stone-900 mb-2">
                    Tag Not Found
                </h1>
                <p className="text-stone-500 text-sm mb-6">
                    This tag doesn&apos;t exist or may have been deactivated.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
