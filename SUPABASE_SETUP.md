# Supabase Production Configuration Guide

## 🔧 Required Settings for Project: knjxneabeamgmtmjysqo

### 1. Authentication Settings
**Path:** Dashboard → Authentication → Settings

**Site URL:**
```
https://rental-manager-82fg8kmno-kishori-raut.vercel.app
```

**Redirect URLs (add all):**
```
https://rental-manager-82fg8kmno-kishori-raut.vercel.app/**
http://localhost:8080/**
http://127.0.0.1:8080/**
```

### 2. CORS Settings
**Path:** Dashboard → Settings → API

**Allowed Origins:**
```
https://rental-manager-82fg8kmno-kishori-raut.vercel.app
http://localhost:8080
http://127.0.0.1:8080
```

### 3. Row Level Security (RLS) Policies
Ensure your RLS policies allow access from your production URL.

### 4. Environment Variables
Your current production environment variables:
```
VITE_SUPABASE_URL=https://knjxneabeamgmtmjysqo.supabase.co
VITE_SUPABASE_PROJECT_ID=knjxneabeamgmtmjysqo
```

## 🚀 After Configuration
1. Save all settings in Supabase dashboard
2. Wait 1-2 minutes for changes to propagate
3. Test PWA install on production URL
4. Verify authentication works correctly

## 📱 Testing PWA Install
1. Open: https://rental-manager-82fg8kmno-kishori-raut.vercel.app
2. Check console for any errors
3. Look for install prompt/button
4. Test authentication flow

## 🔍 Troubleshooting
If PWA still doesn't work:
- Check Supabase logs for authentication errors
- Verify CORS origins are correctly set
- Ensure site URL matches exactly
- Clear browser cache and retry
