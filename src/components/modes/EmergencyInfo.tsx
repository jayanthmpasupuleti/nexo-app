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
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-lg mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🏥</span>
                        <h1 className="text-lg font-semibold text-stone-900">
                            Medical ID
                        </h1>
                    </div>
                    <a
                        href="tel:911"
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Call 911
                    </a>
                </div>

                {/* Blood Type */}
                {data.blood_type && (
                    <div className="bg-white rounded-xl border border-stone-200 p-6 mb-4 text-center">
                        <p className="text-stone-500 text-sm mb-1">Blood Type</p>
                        <p className="text-4xl font-bold text-stone-900">{data.blood_type}</p>
                    </div>
                )}

                {/* Medical Info Sections */}
                <div className="space-y-4">
                    {/* Allergies */}
                    {data.allergies && data.allergies.length > 0 && (
                        <div className="bg-white rounded-xl border border-stone-200 p-4">
                            <h3 className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
                                <span>⚠️</span> Allergies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.allergies.map((allergy, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-100"
                                    >
                                        {allergy}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {data.medications && data.medications.length > 0 && (
                        <div className="bg-white rounded-xl border border-stone-200 p-4">
                            <h3 className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
                                <span>💊</span> Medications
                            </h3>
                            <ul className="space-y-2">
                                {data.medications.map((med, i) => (
                                    <li key={i} className="text-stone-700">{med}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Medical Conditions */}
                    {data.conditions && data.conditions.length > 0 && (
                        <div className="bg-white rounded-xl border border-stone-200 p-4">
                            <h3 className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
                                <span>🩺</span> Medical Conditions
                            </h3>
                            <ul className="space-y-2">
                                {data.conditions.map((condition, i) => (
                                    <li key={i} className="text-stone-700">{condition}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Notes */}
                    {data.notes && (
                        <div className="bg-white rounded-xl border border-stone-200 p-4">
                            <h3 className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
                                <span>📋</span> Notes
                            </h3>
                            <p className="text-stone-700">{data.notes}</p>
                        </div>
                    )}

                    {/* Emergency Contacts */}
                    {contacts.length > 0 && (
                        <div className="bg-white rounded-xl border border-stone-200 p-4">
                            <h3 className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
                                <span>📞</span> Emergency Contacts
                            </h3>
                            <div className="space-y-3">
                                {contacts.map((contact, i) => (
                                    <a
                                        key={i}
                                        href={`tel:${contact.phone}`}
                                        className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                                    >
                                        <div>
                                            <p className="text-stone-900 font-medium">{contact.name}</p>
                                            <p className="text-stone-500 text-sm">{contact.relationship}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                            📞
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Doctor Info */}
                    {(data.doctor_name || data.doctor_phone) && (
                        <div className="bg-white rounded-xl border border-stone-200 p-4">
                            <h3 className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
                                <span>👨‍⚕️</span> Primary Care Doctor
                            </h3>
                            <a
                                href={`tel:${data.doctor_phone}`}
                                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                            >
                                <div>
                                    <p className="text-stone-900 font-medium">{data.doctor_name}</p>
                                    <p className="text-stone-500 text-sm">{data.doctor_phone}</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                    📞
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-stone-400 text-xs mt-8">
                    Powered by Nexo
                </p>
            </div>
        </div>
    )
}
