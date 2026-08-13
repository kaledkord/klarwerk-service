/*
# Fix RLS policies on contact_submissions

## Problem
Four policies flagged as security risks:
1. `allow_public_insert` — duplicate INSERT policy from an earlier migration (always-true, redundant).
2. `anon_insert_submissions` — kept, but was also flagged; re-created scoped to `TO anon` only.
3. `auth_update_submissions` — USING(true) + WITH CHECK(true) for authenticated: any
   authenticated Supabase user could UPDATE every row. No admin UI exists; this is unnecessary.
4. `auth_delete_submissions` — USING(true) for authenticated: any authenticated user could
   DELETE every row. Same reasoning — unnecessary and dangerous.

## Changes
- DROP `allow_public_insert` (duplicate of `anon_insert_submissions`).
- DROP `auth_update_submissions` (no admin UI; service_role key in the dashboard bypasses RLS).
- DROP `auth_delete_submissions` (same reason).
- RECREATE `anon_insert_submissions` scoped to `TO anon` only, since the contact form never
  requires a login. WITH CHECK (true) is intentional — a public contact form must accept
  anonymous submissions.

## Security
- Anon users: INSERT only (contact form). Cannot read, update, or delete any row.
- Authenticated users: SELECT only (admin review via Supabase dashboard).
- Service role: full access, bypasses RLS (used for dashboard / back-office work).
*/

-- Remove the duplicate INSERT policy added by the first migration
DROP POLICY IF EXISTS "allow_public_insert" ON contact_submissions;

-- Remove the overly-broad UPDATE + DELETE policies (no admin UI in this app)
DROP POLICY IF EXISTS "auth_update_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "auth_delete_submissions" ON contact_submissions;

-- Re-create the INSERT policy scoped to anon only (no authenticated needed for a public form)
DROP POLICY IF EXISTS "anon_insert_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_submissions" ON contact_submissions FOR INSERT
  TO anon
  WITH CHECK (true);
