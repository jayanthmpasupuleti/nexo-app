'use client'

import type { EmergencyInfo } from '@/lib/types/database'

interface EmergencyInfoProps {
    data: EmergencyInfo
}

interface Contact {
    name: string
    phone: string
    relationship: string
}

export default function EmergencyInfoMode({ data }: EmergencyInfoProps) {
    const contacts = (data.emergency_contacts as Contact[]) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-slate-900 relative overflow-hidden">
            {/* Warning pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="text-4xl">🏥</span>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                        Emergency Info
                    </h1>
                </div>

                {/* Blood Type Badge */}
                {data.blood_type && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-white text-red-900 px-8 py-4 rounded-2xl shadow-lg">
                            <p className="text-xs text-red-700 uppercase tracking-wider mb-1">Blood Type</p>
                            <p className="text-4xl font-bold text-center">{data.blood_type}</p>
                        </div>
                    </div>
                )}

                {/* Info Sections */}
                <div className="space-y-4">
                    {/* Allergies */}
                    {data.allergies && data.allergies.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
                            <h3 className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>⚠️</span> Allergies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.allergies.map((allergy, i) => (
                                    <span key={i} className="bg-red-500/30 text-white px-3 py-1 rounded-full text-sm">
                                        {allergy}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {data.medications && data.medications.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
                            <h3 className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>💊</span> Medications
                            </h3>
                            <div className="space-y-2">
                                {data.medications.map((med, i) => (
                                    <p key={i} className="text-white">{med}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medical Conditions */}
                    {data.conditions && data.conditions.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
                            <h3 className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>🩺</span> Medical Conditions
                            </h3>
                            <div className="space-y-2">
                                {data.conditions.map((condition, i) => (
                                    <p key={i} className="text-white">{condition}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {data.notes && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
                            <h3 className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>📋</span> Notes
                            </h3>
                            <p className="text-white">{data.notes}</p>
                        </div>
                    )}

                    {/* Emergency Contacts */}
                    {contacts.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
                            <h3 className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>📞</span> Emergency Contacts
                            </h3>
                            <div className="space-y-3">
                                {contacts.map((contact, i) => (
                                    <a
                                        key={i}
                                        href={`tel:${contact.phone}`}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        <div>
                                            <p className="text-white font-medium">{contact.name}</p>
                                            <p className="text-white/60 text-sm">{contact.relationship}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-xl">📞</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Doctor Info */}
                    {(data.doctor_name || data.doctor_phone) && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
                            <h3 className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>👨‍⚕️</span> Doctor Information
                            </h3>
                            <a
                                href={`tel:${data.doctor_phone}`}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <div>
                                    <p className="text-white font-medium">{data.doctor_name}</p>
                                    <p className="text-white/60 text-sm">Primary Care</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-xl">📞</span>
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                {/* Call 911 Button */}
                <a
                    href="tel:911"
                    className="block w-full mt-6 py-5 bg-red-600 text-white text-xl font-bold rounded-2xl text-center hover:bg-red-500 transition-colors shadow-lg shadow-red-500/30"
                >
                    🚨 Call 911
                </a>

                {/* Powered by */}
                <p className="text-white/30 text-xs mt-6 text-center">Powered by Nexo</p>
            </div>
        </div>
    )
}
