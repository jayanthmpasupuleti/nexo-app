import Link from 'next/link'

export default function TagNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="text-center">
                <div className="text-8xl mb-6">🏷️</div>
                <h1 className="text-2xl font-bold text-white mb-3">
                    Tag Not Found
                </h1>
                <p className="text-white/60 mb-6 max-w-sm">
                    This NFC tag doesn&apos;t exist or has been deactivated by its owner.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-white/90 transition-colors"
                >
                    Get Your Own Tag
                </Link>
            </div>
        </div>
    )
}
