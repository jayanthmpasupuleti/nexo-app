-- Analytics Schema for Nexo
-- Run this in Supabase SQL Editor AFTER the avatar storage migration

-- ===========================================
-- TAP EVENTS TABLE
-- ===========================================

-- Store individual tap events for detailed analytics
CREATE TABLE tap_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tapped_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_agent TEXT,
  referrer TEXT
);

-- Indexes for efficient queries
CREATE INDEX idx_tap_events_tag_id ON tap_events(tag_id);
CREATE INDEX idx_tap_events_tapped_at ON tap_events(tapped_at);
CREATE INDEX idx_tap_events_tag_time ON tap_events(tag_id, tapped_at DESC);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE tap_events ENABLE ROW LEVEL SECURITY;

-- Users can view tap events for their own tags
CREATE POLICY "Users can view their tag tap events"
ON tap_events FOR SELECT
USING (
  tag_id IN (
    SELECT id FROM tags WHERE user_id = auth.uid()
  )
);

-- Allow inserting tap events (for public tag scans)
CREATE POLICY "Allow inserting tap events"
ON tap_events FOR INSERT
WITH CHECK (true);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to get tap counts by day for a tag
CREATE OR REPLACE FUNCTION get_tap_counts_by_day(
  p_tag_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  tap_date DATE,
  tap_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(tapped_at) as tap_date,
    COUNT(*) as tap_count
  FROM tap_events
  WHERE tag_id = p_tag_id
    AND tapped_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY DATE(tapped_at)
  ORDER BY tap_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tap counts by hour for a tag
CREATE OR REPLACE FUNCTION get_tap_counts_by_hour(
  p_tag_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  hour_of_day INTEGER,
  tap_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(HOUR FROM tapped_at)::INTEGER as hour_of_day,
    COUNT(*) as tap_count
  FROM tap_events
  WHERE tag_id = p_tag_id
    AND tapped_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY EXTRACT(HOUR FROM tapped_at)
  ORDER BY hour_of_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
