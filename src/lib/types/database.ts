// Database types - manually defined to match Supabase schema
// After running migrations, you can generate types with:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.ts

export type TagMode =
    | 'business_card'
    | 'wifi'
    | 'link_hub'
    | 'emergency'
    | 'redirect'

export type WifiSecurity = 'WPA' | 'WPA2' | 'WPA3' | 'WEP' | 'nopass'

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            tags: {
                Row: {
                    id: string
                    code: string
                    user_id: string
                    label: string | null
                    active_mode: TagMode
                    is_active: boolean
                    tap_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    user_id: string
                    label?: string | null
                    active_mode?: TagMode
                    is_active?: boolean
                    tap_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    user_id?: string
                    label?: string | null
                    active_mode?: TagMode
                    is_active?: boolean
                    tap_count?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            business_cards: {
                Row: {
                    id: string
                    tag_id: string
                    name: string
                    title: string | null
                    company: string | null
                    email: string | null
                    phone: string | null
                    website: string | null
                    linkedin: string | null
                    bio: string | null
                    avatar_url: string | null
                    theme: Record<string, unknown> | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tag_id: string
                    name: string
                    title?: string | null
                    company?: string | null
                    email?: string | null
                    phone?: string | null
                    website?: string | null
                    linkedin?: string | null
                    bio?: string | null
                    avatar_url?: string | null
                    theme?: Record<string, unknown> | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tag_id?: string
                    name?: string
                    title?: string | null
                    company?: string | null
                    email?: string | null
                    phone?: string | null
                    website?: string | null
                    linkedin?: string | null
                    bio?: string | null
                    avatar_url?: string | null
                    theme?: Record<string, unknown> | null
                    created_at?: string
                    updated_at?: string
                }
            }
            wifi_configs: {
                Row: {
                    id: string
                    tag_id: string
                    ssid: string
                    password: string
                    security: WifiSecurity
                    hidden: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tag_id: string
                    ssid: string
                    password: string
                    security?: WifiSecurity
                    hidden?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tag_id?: string
                    ssid?: string
                    password?: string
                    security?: WifiSecurity
                    hidden?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            link_hubs: {
                Row: {
                    id: string
                    tag_id: string
                    title: string
                    bio: string | null
                    avatar_url: string | null
                    links: Array<{ title: string; url: string; icon?: string }>
                    theme: Record<string, unknown> | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tag_id: string
                    title: string
                    bio?: string | null
                    avatar_url?: string | null
                    links?: Array<{ title: string; url: string; icon?: string }>
                    theme?: Record<string, unknown> | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tag_id?: string
                    title?: string
                    bio?: string | null
                    avatar_url?: string | null
                    links?: Array<{ title: string; url: string; icon?: string }>
                    theme?: Record<string, unknown> | null
                    created_at?: string
                    updated_at?: string
                }
            }
            emergency_infos: {
                Row: {
                    id: string
                    tag_id: string
                    blood_type: string | null
                    allergies: string[] | null
                    medications: string[] | null
                    conditions: string[] | null
                    emergency_contacts: Array<{ name: string; phone: string; relationship: string }> | null
                    doctor_name: string | null
                    doctor_phone: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tag_id: string
                    blood_type?: string | null
                    allergies?: string[] | null
                    medications?: string[] | null
                    conditions?: string[] | null
                    emergency_contacts?: Array<{ name: string; phone: string; relationship: string }> | null
                    doctor_name?: string | null
                    doctor_phone?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tag_id?: string
                    blood_type?: string | null
                    allergies?: string[] | null
                    medications?: string[] | null
                    conditions?: string[] | null
                    emergency_contacts?: Array<{ name: string; phone: string; relationship: string }> | null
                    doctor_name?: string | null
                    doctor_phone?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            custom_redirects: {
                Row: {
                    id: string
                    tag_id: string
                    url: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tag_id: string
                    url: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tag_id?: string
                    url?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Enums: {
            tag_mode: TagMode
            wifi_security: WifiSecurity
        }
    }
}

// Helper types for easier access
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type BusinessCard = Database['public']['Tables']['business_cards']['Row']
export type WifiConfig = Database['public']['Tables']['wifi_configs']['Row']
export type LinkHub = Database['public']['Tables']['link_hubs']['Row']
export type EmergencyInfo = Database['public']['Tables']['emergency_infos']['Row']
export type CustomRedirect = Database['public']['Tables']['custom_redirects']['Row']

// Type for tag with its mode data
export type TagWithData = Tag & {
    business_cards?: BusinessCard | null
    wifi_configs?: WifiConfig | null
    link_hubs?: LinkHub | null
    emergency_infos?: EmergencyInfo | null
    custom_redirects?: CustomRedirect | null
}
