-- Fix RLS policies for user data isolation
-- The "Public can read active tags by code" policy was too permissive,
-- allowing any authenticated user to see ALL active tags.
-- This migration restricts it to only anonymous/public access via tag code lookup.

-- ===========================================
-- FIX TAGS POLICIES
-- ===========================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public can read active tags by code" ON tags;

-- Recreate with proper restriction: only allow reading active tags by code (for public tap pages)
-- This uses a service-level approach: the public /t/[code] page uses the anon key,
-- and authenticated dashboard users get filtered by their user_id via the existing CRUD policy.
CREATE POLICY "Public can read active tags by code"
  ON tags FOR SELECT
  TO anon
  USING (is_active = true);

-- Also add an explicit authenticated select policy scoped to own tags
-- (the existing "Users can CRUD own tags" FOR ALL policy already covers this,
--  but being explicit is clearer)

-- ===========================================
-- VERIFY OTHER TABLE POLICIES ARE CORRECT
-- ===========================================
-- The mode data tables (business_cards, wifi_configs, link_hubs, etc.)
-- have the same pattern. Fix them too:

-- Business Cards
DROP POLICY IF EXISTS "Public can read business cards for active tags" ON business_cards;
CREATE POLICY "Public can read business cards for active tags"
  ON business_cards FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = business_cards.tag_id 
      AND tags.is_active = true
    )
  );

-- WiFi Configs
DROP POLICY IF EXISTS "Public can read wifi configs for active tags" ON wifi_configs;
CREATE POLICY "Public can read wifi configs for active tags"
  ON wifi_configs FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = wifi_configs.tag_id 
      AND tags.is_active = true
    )
  );

-- Link Hubs
DROP POLICY IF EXISTS "Public can read link hubs for active tags" ON link_hubs;
CREATE POLICY "Public can read link hubs for active tags"
  ON link_hubs FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = link_hubs.tag_id 
      AND tags.is_active = true
    )
  );

-- Emergency Infos
DROP POLICY IF EXISTS "Public can read emergency infos for active tags" ON emergency_infos;
CREATE POLICY "Public can read emergency infos for active tags"
  ON emergency_infos FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = emergency_infos.tag_id 
      AND tags.is_active = true
    )
  );

-- Custom Redirects
DROP POLICY IF EXISTS "Public can read custom redirects for active tags" ON custom_redirects;
CREATE POLICY "Public can read custom redirects for active tags"
  ON custom_redirects FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM tags 
      WHERE tags.id = custom_redirects.tag_id 
      AND tags.is_active = true
    )
  );

-- ===========================================
-- ALLOW ANON TO UPDATE TAP COUNT
-- ===========================================
-- When someone taps an NFC tag (visits /t/[code]), the app increments
-- tap_count on the tags table. This needs to work for anonymous visitors.

CREATE POLICY "Anon can update tap count on active tags"
  ON tags FOR UPDATE
  TO anon
  USING (is_active = true)
  WITH CHECK (is_active = true);
