/*
# Create contact_submissions table

## Summary
This migration creates a table for storing contact form submissions from the KlarWerk Service website.

## New Tables
- `contact_submissions`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, required) — full name of the submitter
  - `company` (text, nullable) — company name if applicable
  - `phone` (text, nullable) — phone number
  - `email` (text, required) — email address
  - `message` (text, required) — message content
  - `service` (text, nullable) — requested service type
  - `status` (text, default 'new') — submission status for internal tracking
  - `created_at` (timestamptz, auto-set) — submission timestamp

## Security
- RLS is enabled on `contact_submissions`.
- Anonymous and authenticated users may INSERT (public contact form, no login required).
- No SELECT/UPDATE/DELETE policy for public roles — only service role can manage submissions.

## Notes
1. This is a no-auth public marketing website — form submissions are open to anon role.
2. Admins manage submissions via the Supabase dashboard with the service role key.
3. The `status` column supports workflow states: 'new', 'in_progress', 'resolved'.
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

DROP POLICY IF EXISTS "allow_public_insert" ON contact_submissions;
CREATE POLICY "allow_public_insert" ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);
