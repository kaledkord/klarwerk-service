/*
# Tighten INSERT policy on contact_submissions

## Problem
`anon_insert_submissions` uses `WITH CHECK (true)`, which is flagged as always-true RLS bypass.
Although the columns are NOT NULL at the database level, the RLS policy itself adds no validation.

## Change
Replace `WITH CHECK (true)` with a meaningful predicate that:
- Ensures required fields (name, email, message) are present and non-blank after trimming.
- Prevents submissions where status is set to anything other than 'new'
  (blocks callers from injecting an arbitrary status value on insert).

This makes the clause genuinely conditional and resolves the security warning.
*/

DROP POLICY IF EXISTS "anon_insert_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_submissions" ON contact_submissions FOR INSERT
  TO anon
  WITH CHECK (
    length(trim(name))    > 0 AND
    length(trim(email))   > 0 AND
    length(trim(message)) > 0 AND
    status = 'new'
  );
