import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Nexo</div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Digital Identity,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              One Tap Away
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto">
            Transform any NFC tag into a powerful digital hub. Share contacts, Wi-Fi, links, and more with a single tap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
            >
              Start Free
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          One Tag, Unlimited Possibilities
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="💼"
            title="Business Card"
            description="Share your contact details instantly. Recipients can save your info with one tap."
          />
          <FeatureCard
            icon="📶"
            title="Wi-Fi Sharing"
            description="Let guests connect to your network without typing passwords. Just tap and connect."
          />
          <FeatureCard
            icon="🔗"
            title="Link Hub"
            description="Your personal Linktree. All your important links in one beautiful page."
          />
          <FeatureCard
            icon="🏥"
            title="Emergency Info"
            description="Life-saving medical information accessible when it matters most."
          />
          <FeatureCard
            icon="↗️"
            title="Custom Redirects"
            description="Send visitors anywhere. Perfect for marketing campaigns and promotions."
          />
          <FeatureCard
            icon="🔄"
            title="Switch Anytime"
            description="Change what your tag does whenever you want. No reprinting, no new hardware."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Simple as 1-2-3
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StepCard
            number="1"
            title="Get Your Tag"
            description="Order an NFC keychain or use any NFC-enabled tag you already have."
          />
          <StepCard
            number="2"
            title="Configure"
            description="Choose your mode and customize your content through our dashboard."
          />
          <StepCard
            number="3"
            title="Tap & Share"
            description="Hold your tag near any smartphone. It works automatically."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Go Digital?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands who&apos;ve already upgraded their networking game.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white font-bold text-xl">Nexo</div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Nexo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  )
}
