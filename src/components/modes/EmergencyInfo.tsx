'use client'

import type { EmergencyInfo } from '@/lib/types/database'
import {
    LuHeart,
    LuTriangleAlert,
    LuPill,
    LuStethoscope,
    LuFileText,
    LuPhone,
    LuUser,
    LuSparkles,
    LuSiren
} from 'react-icons/lu'

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
        <div className="min-h-screen">
            <div className="max-w-lg mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-red-100 rounded-lg border-2 border-black flex items-center justify-center">
                            <LuHeart className="text-red-500 text-lg" />
                        </div>
                        <h1 className="text-xl font-bold text-black">
                            Medical ID
                        </h1>
                    </div>
                    <a
                        href="tel:911"
                        className="px-5 py-2 bg-red-500 text-white text-sm font-bold rounded-xl border-2 border-black hover:bg-red-600 transition-colors inline-flex items-center gap-2"
                        style={{ boxShadow: '3px 3px 0 black' }}
                    >
                        <LuSiren /> Call 911
                    </a>
                </div>

                {/* Blood Type */}
                {data.blood_type && (
                    <div className="shadow-golden p-6 mb-4 text-center">
                        <p className="text-black/60 text-sm font-medium mb-1">Blood Type</p>
                        <p className="text-5xl font-bold text-black">{data.blood_type}</p>
                    </div>
                )}

                {/* Medical Info Sections */}
                <div className="space-y-4">
                    {/* Allergies */}
                    {data.allergies && data.allergies.length > 0 && (
                        <div className="shadow-golden bg-red-50 p-4">
                            <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                <LuTriangleAlert className="text-red-500" /> Allergies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.allergies.map((allergy, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-red-200 text-black rounded-full text-sm font-bold border-2 border-black"
                                    >
                                        {allergy}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {data.medications && data.medications.length > 0 && (
                        <div className="shadow-blue p-4">
                            <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                <LuPill className="text-[var(--blue)]" /> Medications
                            </h3>
                            <ul className="space-y-2">
                                {data.medications.map((med, i) => (
                                    <li key={i} className="text-black font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[var(--blue)] rounded-full"></span>
                                        {med}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Medical Conditions */}
                    {data.conditions && data.conditions.length > 0 && (
                        <div className="shadow-golden p-4">
                            <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                <LuStethoscope className="text-[var(--golden)]" /> Medical Conditions
                            </h3>
                            <ul className="space-y-2">
                                {data.conditions.map((condition, i) => (
                                    <li key={i} className="text-black font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[var(--golden)] rounded-full"></span>
                                        {condition}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Notes */}
                    {data.notes && (
                        <div className="shadow-blue p-4">
                            <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                <LuFileText className="text-[var(--blue)]" /> Notes
                            </h3>
                            <p className="text-black font-medium">{data.notes}</p>
                        </div>
                    )}

                    {/* Emergency Contacts */}
                    {contacts.length > 0 && (
                        <div className="shadow-golden p-4">
                            <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                <LuPhone className="text-[var(--golden)]" /> Emergency Contacts
                            </h3>
                            <div className="space-y-2">
                                {contacts.map((contact, i) => (
                                    <a
                                        key={i}
                                        href={`tel:${contact.phone}`}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-black hover:bg-[var(--golden-light)] transition-colors"
                                    >
                                        <div>
                                            <p className="text-black font-bold">{contact.name}</p>
                                            <p className="text-black/60 text-sm font-medium">{contact.relationship}</p>
                                        </div>
                                        <div
                                            className="w-10 h-10 bg-green-400 rounded-full border-2 border-black flex items-center justify-center"
                                            style={{ boxShadow: '2px 2px 0 black' }}
                                        >
                                            <LuPhone className="text-black" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Doctor Info */}
                    {(data.doctor_name || data.doctor_phone) && (
                        <div className="shadow-blue p-4">
                            <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                <LuUser className="text-[var(--blue)]" /> Primary Care Doctor
                            </h3>
                            <a
                                href={`tel:${data.doctor_phone}`}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-black hover:bg-[var(--blue-light)] transition-colors"
                            >
                                <div>
                                    <p className="text-black font-bold">{data.doctor_name}</p>
                                    <p className="text-black/60 text-sm font-medium">{data.doctor_phone}</p>
                                </div>
                                <div
                                    className="w-10 h-10 bg-[var(--blue)] rounded-full border-2 border-black flex items-center justify-center"
                                    style={{ boxShadow: '2px 2px 0 black' }}
                                >
                                    <LuPhone className="text-black" />
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-black/40 text-xs mt-8 font-medium flex items-center justify-center gap-1">
                    <LuSparkles className="text-[var(--golden)]" /> Powered by Nexo
                </p>
            </div>
        </div>
    )
}
