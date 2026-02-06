# Supabase Setup Guide

Step-by-step instructions to create and configure your Supabase project.

## 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub, Google, or email

## 2. Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in:
   - **Project name**: `nexo` (or any name you prefer)
   - **Database Password**: Generate a strong password and **save it somewhere safe**
   - **Region**: Choose the closest to your users (e.g., Mumbai for India)
4. Click "Create new project"
5. Wait 1-2 minutes for the project to be provisioned

## 3. Get Your API Keys

1. Once the project is ready, go to **Settings** → **API**
2. Copy these values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://abc123xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=nexoapp.in
```

## 4. Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" (or Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" for each statement

## 5. Enable Authentication

1. Go to **Authentication** → **Providers**
2. Email is enabled by default
3. (Optional) Enable Google Auth:
   - Click on Google provider
   - Toggle it on
   - Follow instructions to set up OAuth credentials
   - Add `http://localhost:3000` to authorized origins

## 6. Verify Setup

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `profiles`
   - `tags`
   - `business_cards`
   - `wifi_configs`
   - `link_hubs`
   - `emergency_infos`
   - `custom_redirects`

## Troubleshooting

### "relation does not exist" error
Make sure you ran all the SQL migrations in the correct order.

### Auth not working
1. Check that both env variables are set correctly
2. Restart your Next.js dev server after changing `.env.local`

### RLS blocking queries
RLS policies require a logged-in user for most operations. The `/t/[code]` public route has special policies that allow public reads.
