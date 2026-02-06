import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-stone-900">Nexo</div>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-stone-600 hover:text-stone-900 transition-colors text-sm"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-stone-600 text-sm mb-6">
            <span>✨</span>
            <span>NFC-powered digital identity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-stone-900 mb-6 leading-tight tracking-tight">
            Share your digital identity
            <br />
            <span className="text-stone-400">with a single tap</span>
          </h1>
          <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Transform any NFC tag into a powerful hub for contacts, Wi-Fi credentials, links, and more. No app required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Start for free
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-stone-900 mb-3">
              One tag, endless possibilities
            </h2>
            <p className="text-stone-500">
              Configure your NFC tag to work exactly how you need it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="💼"
              title="Business Card"
              description="Share contact details instantly. Save to phone with one tap."
            />
            <FeatureCard
              icon="📶"
              title="Wi-Fi Sharing"
              description="Connect guests to your network. No password typing needed."
            />
            <FeatureCard
              icon="🔗"
              title="Link Hub"
              description="All your links in one place. Like Linktree, but on a tag."
            />
            <FeatureCard
              icon="🏥"
              title="Emergency Info"
              description="Medical info accessible in emergencies. Could save a life."
            />
            <FeatureCard
              icon="↗️"
              title="Redirect"
              description="Send visitors to any URL. Perfect for marketing."
            />
            <FeatureCard
              icon="🔄"
              title="Switch Modes"
              description="Change what your tag does anytime. No new hardware."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-stone-900 mb-3">
              How it works
            </h2>
            <p className="text-stone-500">
              Get started in under 5 minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Get a tag"
              description="Use any NFC tag or keychain. We also sell premium ones."
            />
            <StepCard
              number="2"
              title="Configure"
              description="Choose a mode and customize your content in our dashboard."
            />
            <StepCard
              number="3"
              title="Share"
              description="Hold near any smartphone. It just works, no app needed."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-stone-900 mb-3">
            Ready to go digital?
          </h2>
          <p className="text-stone-500 mb-8">
            Join thousands who&apos;ve already upgraded their networking.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-stone-900 font-semibold">Nexo</div>
            <p className="text-stone-400 text-sm">
              © {new Date().getFullYear()} Nexo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 hover:border-stone-300 hover:shadow-sm transition-all">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-medium text-stone-900 mb-1">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center font-medium mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
