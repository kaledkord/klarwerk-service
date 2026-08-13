/*
# Create contact_submissions table

1. Purpose
   Stores contact form submissions from the KlarWerk Service website.
   This is a no-auth app (no sign-in screen), so the frontend operates
   as the `anon` role. The public INSERT policy allows anyone to submit
   a contact request. SELECT/UPDATE/DELETE are restricted to
   authenticated users (site admin) only.

2. New Tables
   - `contact_submissions`
     - `id` (uuid, primary key, default gen_random_uuid())
     - `name` (text, not null) — submitter's name
     - `company` (text, nullable) — optional company name
     - `phone` (text, nullable) — optional phone number
     - `email` (text, not null) — submitter's email
     - `message` (text, not null) — the message/inquiry
     - `service` (text, nullable) — requested service ID
     - `status` (text, default 'new') — processing status
     - `created_at` (timestamptz, default now())

3. Security (RLS)
   - RLS enabled on `contact_submissions`.
   - INSERT: `TO anon, authenticated` with `WITH CHECK (true)` — anyone
     can submit a contact form (intentionally public).
   - SELECT/UPDATE/DELETE: `TO authenticated` only — only the site
     admin (authenticated) can read, update status, or delete
     submissions. The anon frontend cannot read other people's
     submissions.

4. Indexes
   - Index on `created_at` for chronological sorting.
   - Index on `status` for filtering pending submissions.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  phone text,
  email text NOT NULL,
  message text NOT NULL,
  service text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to insert new submissions
DROP POLICY IF EXISTS "anon_insert_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_submissions" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated users (admin) can read submissions
DROP POLICY IF EXISTS "auth_select_submissions" ON contact_submissions;
CREATE POLICY "auth_select_submissions" ON contact_submissions FOR SELECT
  TO authenticated USING (true);

-- Only authenticated users (admin) can update submissions
DROP POLICY IF EXISTS "auth_update_submissions" ON contact_submissions;
CREATE POLICY "auth_update_submissions" ON contact_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated users (admin) can delete submissions
DROP POLICY IF EXISTS "auth_delete_submissions" ON contact_submissions;
CREATE POLICY "auth_delete_submissions" ON contact_submissions FOR DELETE
  TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
  ON contact_submissions (status);
