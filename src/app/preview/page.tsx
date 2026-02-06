import BusinessCardMode from '@/components/modes/BusinessCard'
import WiFiShare from '@/components/modes/WiFiShare'
import LinkHubMode from '@/components/modes/LinkHub'
import EmergencyInfoMode from '@/components/modes/EmergencyInfo'

// Demo data for previewing mode components
const demoBusinessCard = {
    id: 'demo',
    tag_id: 'demo',
    name: 'Alex Chen',
    title: 'Senior Product Designer',
    company: 'TechCorp Inc.',
    email: 'alex@techcorp.com',
    phone: '+1 (555) 123-4567',
    website: 'https://alexchen.design',
    linkedin: 'https://linkedin.com/in/alexchen',
    bio: 'Passionate about creating user-centered designs that solve real problems. 10+ years of experience in tech.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

const demoWifi = {
    id: 'demo',
    tag_id: 'demo',
    ssid: 'TechCorp Guest',
    password: 'Welcome2024!',
    security: 'WPA2' as const,
    hidden: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

const demoLinkHub = {
    id: 'demo',
    tag_id: 'demo',
    title: 'Sarah Martinez',
    bio: 'Content Creator | Travel & Lifestyle ✈️',
    links: [
        { title: 'Instagram', url: 'https://instagram.com/sarah', icon: '📸' },
        { title: 'YouTube', url: 'https://youtube.com/sarah', icon: '🎬' },
        { title: 'Personal Blog', url: 'https://sarahwrites.com', icon: '📝' },
        { title: 'LinkedIn', url: 'https://linkedin.com/in/sarah', icon: '💼' },
        { title: 'Contact Me', url: 'mailto:sarah@email.com', icon: '✉️' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

const demoEmergency = {
    id: 'demo',
    tag_id: 'demo',
    blood_type: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    emergency_contacts: [
        { name: 'John Doe', phone: '+1-555-987-6543', relationship: 'Spouse' },
    ],
    doctor_name: 'Dr. Sarah Wilson',
    doctor_phone: '+1-555-111-2222',
    notes: 'Uses insulin pump. DNR on file.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

export default function PreviewPage({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string }>
}) {
    // Need to handle async searchParams in Next.js 16
    return <PreviewContent searchParamsPromise={searchParams} />
}

async function PreviewContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ mode?: string }> }) {
    const searchParams = await searchParamsPromise
    const mode = searchParams.mode || 'business_card'

    if (mode === 'wifi') {
        return <WiFiShare data={demoWifi} />
    }
    if (mode === 'link_hub') {
        return <LinkHubMode data={demoLinkHub} />
    }
    if (mode === 'emergency') {
        return <EmergencyInfoMode data={demoEmergency} />
    }
    // Default: business_card
    return <BusinessCardMode data={demoBusinessCard} />
}
