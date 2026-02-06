export default function TagLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-3 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
                <p className="text-stone-500 text-sm">Loading...</p>
            </div>
        </div>
    )
}
