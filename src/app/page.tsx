import Link from 'next/link'
import {
  LuSparkles,
  LuBriefcase,
  LuWifi,
  LuLink,
  LuHeart,
  LuExternalLink,
  LuRefreshCw,
  LuArrowRight
} from 'react-icons/lu'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold text-black">
              <LuSparkles className="text-[var(--golden)]" />
              <span>Nexo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-black/70 hover:text-black transition-colors font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--golden-light)] border-2 border-black rounded-full text-black text-sm font-medium mb-8">
            <LuSparkles className="text-[var(--golden)]" />
            <span>NFC-powered digital identity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight tracking-tight">
            Share your digital identity
            <br />
            <span className="text-[var(--blue)]">with a single tap</span>
          </h1>
          <p className="text-lg text-black/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Transform any NFC tag into a powerful hub for contacts, Wi-Fi credentials, links, and more. No app required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-primary text-base inline-flex items-center justify-center gap-2"
            >
              Start for free <LuArrowRight />
            </Link>
            <Link
              href="#features"
              className="btn-secondary text-base"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-t-2 border-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-black mb-3">
              One tag, endless possibilities
            </h2>
            <p className="text-black/60">
              Configure your NFC tag to work exactly how you need it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<LuBriefcase />}
              title="Business Card"
              description="Share contact details instantly. Save to phone with one tap."
              color="golden"
            />
            <FeatureCard
              icon={<LuWifi />}
              title="Wi-Fi Sharing"
              description="Connect guests to your network. No password typing needed."
              color="blue"
            />
            <FeatureCard
              icon={<LuLink />}
              title="Link Hub"
              description="All your links in one place. Like Linktree, but on a tag."
              color="golden"
            />
            <FeatureCard
              icon={<LuHeart />}
              title="Emergency Info"
              description="Medical info accessible in emergencies. Could save a life."
              color="blue"
            />
            <FeatureCard
              icon={<LuExternalLink />}
              title="Redirect"
              description="Send visitors to any URL. Perfect for marketing."
              color="golden"
            />
            <FeatureCard
              icon={<LuRefreshCw />}
              title="Switch Modes"
              description="Change what your tag does anytime. No new hardware."
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-black mb-3">
              How it works
            </h2>
            <p className="text-black/60">
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
      <section className="py-20 bg-[var(--golden)] border-t-2 border-black">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-black mb-3">
            Ready to go digital?
          </h2>
          <p className="text-black/70 mb-8">
            Join thousands who&apos;ve already upgraded their networking.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-black text-white rounded-xl font-semibold border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <LuSparkles className="text-[var(--golden)]" />
              <span>Nexo</span>
            </div>
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Nexo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: 'golden' | 'blue' }) {
  const shadowClass = color === 'golden' ? 'shadow-golden' : 'shadow-blue'
  const iconBg = color === 'golden' ? 'bg-[var(--golden)]' : 'bg-[var(--blue)]'

  return (
    <div className={`${shadowClass} p-6 card-hover`}>
      <div className={`w-12 h-12 ${iconBg} rounded-xl border-2 border-black flex items-center justify-center text-xl text-black mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-black mb-2">{title}</h3>
      <p className="text-black/60 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-[var(--golden)] text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 border-2 border-black shadow-[3px_3px_0_#000]">
        {number}
      </div>
      <h3 className="font-semibold text-black mb-2">{title}</h3>
      <p className="text-black/60 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
