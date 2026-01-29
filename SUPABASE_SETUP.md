# Supabase Setup Guide

This project handles authentication using Supabase. Follow these steps to ensure everything works correctly.

## 1. Environment Variables

Ensure your `.env` file contains the correct keys from your Supabase project settings.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in **Settings > API** in your Supabase dashboard.

## 2. Authentication Configuration

Go to **Authentication > URL Configuration** in Supabase and add your Site URL.

- **Site URL**: `http://localhost:3000` (for local development)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

This is critical. If you deploy your app (e.g. to Vercel), allow that domain here as well (e.g. `https://my-app.vercel.app` & `https://my-app.vercel.app/auth/callback`).

## 3. Email Authentication

Go to **Authentication > Providers > Email** and ensure it is **Enabled**.

- **Confirm Email**: If this is enabled (default), new users must click the link in their email before they can sign in.
- **Secure Password Change**: Recommended to enable.

## 4. Creating Users

Since registration is restricted, you must add users manually or use the provided script.

### Option A: Using Supabase Dashboard

1. Go to **Authentication > Users**.
2. Click **Add User**.
3. Enter email and check "Auto Confirm User".

### Option B: Using Helper Script (Local Only)

We have a script to create users utilizing your Service Role Key (keep this key secret!).

```bash
# Provide email and password
node scripts/create-user.js employee@example.com password123
```

_(Ensure `SUPABASE_SERVICE_ROLE_KEY` is in your `.env` for this script to work)_
