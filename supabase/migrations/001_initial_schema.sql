-- Nexo NFC Platform - Initial Schema
-- Run this in Supabase SQL Editor

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE tag_mode AS ENUM (
  'business_card',
  'wifi',
  'link_hub',
  'emergency',
  'redirect'
);

CREATE TYPE wifi_security AS ENUM (
  'WPA',
  'WPA2',
  'WPA3',
  'WEP',
  'nopass'
);

-- ===========================================
-- TABLES
-- ===========================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tags (NFC tag registrations)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  active_mode tag_mode DEFAULT 'business_card' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  tap_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Business Cards (mode data)
CREATE TABLE business_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID UNIQUE NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- WiFi Configs (mode data)
CREATE TABLE wifi_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID UNIQUE NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  ssid TEXT NOT NULL,
  password TEXT NOT NULL,
  security wifi_security DEFAULT 'WPA2' NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Link Hubs (mode data)
CREATE TABLE link_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID UNIQUE NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  links JSONB DEFAULT '[]' NOT NULL,
  theme JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Emergency Infos (mode data)
CREATE TABLE emergency_infos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID UNIQUE NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  blood_type TEXT,
  allergies TEXT[],
  medications TEXT[],
  conditions TEXT[],
  emergency_contacts JSONB DEFAULT '[]',
  doctor_name TEXT,
  doctor_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Custom Redirects (mode data)
CREATE TABLE custom_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID UNIQUE NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_tags_code ON tags(code);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_active ON tags(is_active) WHERE is_active = true;

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE wifi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_redirects ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tags policies
CREATE POLICY "Users can CRUD own tags"
  ON tags FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read active tags by code"
  ON tags FOR SELECT
  USING (is_active = true);

-- Business Cards policies
CREATE POLICY "Users can CRUD own business cards"
  ON business_cards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = business_cards.tag_id 
      AND tags.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read business cards for active tags"
  ON business_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = business_cards.tag_id 
      AND tags.is_active = true
    )
  );

-- WiFi Configs policies
CREATE POLICY "Users can CRUD own wifi configs"
  ON wifi_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = wifi_configs.tag_id 
      AND tags.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read wifi configs for active tags"
  ON wifi_configs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = wifi_configs.tag_id 
      AND tags.is_active = true
    )
  );

-- Link Hubs policies
CREATE POLICY "Users can CRUD own link hubs"
  ON link_hubs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = link_hubs.tag_id 
      AND tags.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read link hubs for active tags"
  ON link_hubs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = link_hubs.tag_id 
      AND tags.is_active = true
    )
  );

-- Emergency Infos policies
CREATE POLICY "Users can CRUD own emergency infos"
  ON emergency_infos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = emergency_infos.tag_id 
      AND tags.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read emergency infos for active tags"
  ON emergency_infos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = emergency_infos.tag_id 
      AND tags.is_active = true
    )
  );

-- Custom Redirects policies
CREATE POLICY "Users can CRUD own custom redirects"
  ON custom_redirects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = custom_redirects.tag_id 
      AND tags.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read custom redirects for active tags"
  ON custom_redirects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = custom_redirects.tag_id 
      AND tags.is_active = true
    )
  );

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_cards_updated_at
  BEFORE UPDATE ON business_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wifi_configs_updated_at
  BEFORE UPDATE ON wifi_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_link_hubs_updated_at
  BEFORE UPDATE ON link_hubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_infos_updated_at
  BEFORE UPDATE ON emergency_infos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_redirects_updated_at
  BEFORE UPDATE ON custom_redirects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
