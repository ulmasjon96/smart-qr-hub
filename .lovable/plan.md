
# Phase 1: Enable Lovable Cloud + Database Schema + Redirect Edge Function

This phase sets up the entire backend foundation. No UI changes yet -- just the database, security policies, and the redirect system.

---

## Step 1: Enable Lovable Cloud

Activate Lovable Cloud (Supabase) for the project, which will auto-generate the Supabase client at `src/integrations/supabase/`.

---

## Step 2: Database Schema (via migrations)

### 2a. Enum Types

```text
app_role  -> admin | moderator | user
qr_status -> active | paused | expired
plan_type -> free | premium
```

### 2b. Tables

**profiles**
- `id` (uuid, FK to auth.users, PK, ON DELETE CASCADE)
- `full_name` (text, nullable)
- `avatar_url` (text, nullable)
- `language` (text, default 'en')
- `theme` (text, default 'dark')
- `plan` (plan_type, default 'free')
- `created_at`, `updated_at` (timestamptz)

**user_roles**
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users, NOT NULL, ON DELETE CASCADE)
- `role` (app_role, NOT NULL)
- UNIQUE(user_id, role)

**qr_codes**
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users, nullable -- null = guest)
- `type` (text, NOT NULL) -- url, text, phone, etc.
- `form_data` (jsonb, NOT NULL)
- `style_options` (jsonb, NOT NULL)
- `label` (text)
- `short_code` (text, UNIQUE, NOT NULL) -- 6-char alphanumeric
- `destination_url` (text) -- for dynamic QR redirect
- `status` (qr_status, default 'active')
- `expires_at` (timestamptz, nullable)
- `created_at`, `updated_at` (timestamptz)

**scans**
- `id` (uuid, PK)
- `qr_id` (uuid, FK to qr_codes, ON DELETE CASCADE, NOT NULL)
- `scanned_at` (timestamptz, default now())
- `country` (text, nullable)
- `device_type` (text, nullable)
- `user_agent` (text, nullable)
- `ip_hash` (text, nullable) -- hashed, never raw IP

### 2c. Trigger: Auto-create profile on signup

A database trigger function that inserts a row into `profiles` whenever a new user signs up in `auth.users`.

---

## Step 3: Security Definer Function

Create the `has_role()` function as required by the security guidelines:

```text
has_role(user_id uuid, role app_role) -> boolean
  SECURITY DEFINER, searches user_roles table
```

This avoids infinite recursion in RLS policies.

---

## Step 4: Row-Level Security (RLS) Policies

**profiles**
- SELECT: users can read their own profile, OR admins can read all
- UPDATE: users can update their own profile only
- INSERT: handled by trigger (service role)

**user_roles**
- SELECT: admins only (via has_role)
- INSERT/UPDATE/DELETE: admins only (via has_role)

**qr_codes**
- SELECT: owner can see own, admins can see all
- INSERT: authenticated users (user_id must match auth.uid())
- UPDATE: owner only
- DELETE: owner or admin

**scans**
- INSERT: open to all (the edge function uses service role key)
- SELECT: QR owner can see scans for their QR codes, admins can see all
- DELETE: admin only

---

## Step 5: Redirect Edge Function

Create `supabase/functions/redirect/index.ts`:

- Configured with `verify_jwt = false` (public endpoint)
- Receives the short code from the request body or URL
- Looks up qr_codes by short_code
- If not found or status is paused/expired, returns an error/unavailable JSON
- If active, records a scan (timestamp, device type from User-Agent, country approximation from headers)
- Returns the destination_url for client-side redirect
- Hashes any IP before storing (privacy)

### Client-side redirect page

Create `/r/:code` route that:
1. Calls the redirect edge function with the code
2. If destination returned, does `window.location.replace(url)`
3. If unavailable, shows a simple "QR unavailable" message

---

## Step 6: Supabase Client Integration

Update `src/integrations/supabase/` (auto-generated types) and create a small helper for generating short codes:

```text
generateShortCode() -> random 6-char string [A-Za-z0-9]
```

---

## Step 7: App Router Update

Add the `/r/:code` route to `src/App.tsx` pointing to a new `Redirect.tsx` page component.

---

## Summary of New Files

| File | Purpose |
|------|---------|
| Database migrations (5-6) | Schema, enums, RLS, triggers, functions |
| `supabase/functions/redirect/index.ts` | Public redirect + scan recording |
| `supabase/config.toml` (update) | verify_jwt = false for redirect |
| `src/pages/Redirect.tsx` | Client-side /r/:code handler |
| `src/lib/short-code.ts` | Short code generation utility |

## Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Add /r/:code route |

---

## Admin Role Assignment

After you register your first account through the normal signup flow, you will manually insert a row into the `user_roles` table via the Cloud SQL runner:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<your-user-id>', 'admin');
```

No hardcoded credentials are used anywhere in the codebase.
