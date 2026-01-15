-- ============================================================================
-- VIDEON DATABASE SCHEMA
-- ============================================================================
-- This migration creates the core tables for video storage and brand settings.
-- Run this in your Supabase SQL editor or via supabase db push.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- VIDEOS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,

  -- Status: draft | generating | ready | failed
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'failed')),

  -- Generated content
  thumbnail_url TEXT,
  video_url TEXT,

  -- Video plan (JSON) - stores the full Base44Plan
  plan JSONB,

  -- Generation metadata
  generation_progress INTEGER DEFAULT 0, -- 0-100
  generation_started_at TIMESTAMPTZ,
  generation_completed_at TIMESTAMPTZ,
  generation_error TEXT,

  -- Video metadata
  duration_seconds INTEGER,
  width INTEGER DEFAULT 1080,
  height INTEGER DEFAULT 1920,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Users can only see their own videos
CREATE POLICY "Users can view own videos" ON videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON videos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos" ON videos
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- BRAND SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS brand_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Brand identity
  brand_name TEXT NOT NULL DEFAULT 'My Brand',
  logo_url TEXT,

  -- Colors
  primary_color TEXT NOT NULL DEFAULT '#0D9488',
  secondary_color TEXT NOT NULL DEFAULT '#F97316',

  -- Typography
  font_preference TEXT NOT NULL DEFAULT 'Inter',

  -- Additional settings (JSON for flexibility)
  settings JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_brand_settings_user_id ON brand_settings(user_id);

-- Enable RLS
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own brand settings
CREATE POLICY "Users can view own brand settings" ON brand_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand settings" ON brand_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand settings" ON brand_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand settings" ON brand_settings
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- USER PROFILES TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile info
  full_name TEXT,
  avatar_url TEXT,

  -- Subscription
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,

  -- Usage tracking
  videos_generated INTEGER NOT NULL DEFAULT 0,
  videos_limit INTEGER NOT NULL DEFAULT 3, -- Free plan: 3 videos

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- FUNCTION: Auto-create user profile on signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.brand_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_settings_updated_at
  BEFORE UPDATE ON brand_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STORAGE BUCKET FOR VIDEO FILES
-- ============================================================================
-- Note: Run these in Supabase Dashboard > Storage > Create bucket

-- CREATE BUCKET IF NOT EXISTS 'videos' (public: true)
-- CREATE BUCKET IF NOT EXISTS 'thumbnails' (public: true)
-- CREATE BUCKET IF NOT EXISTS 'logos' (public: true)
