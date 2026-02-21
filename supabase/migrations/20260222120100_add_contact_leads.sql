-- Leads from the generated site contact form (Message us)
CREATE TABLE IF NOT EXISTS contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Allow anonymous insert (public site visitors)
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert contact_leads"
  ON contact_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Owners can read their own leads (via slug matching in app or policy with profiles)
CREATE POLICY "Owners can read own contact_leads"
  ON contact_leads FOR SELECT
  TO authenticated
  USING (
    slug IN (SELECT slug FROM profiles WHERE profiles.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS contact_leads_slug_idx ON contact_leads(slug);
CREATE INDEX IF NOT EXISTS contact_leads_created_at_idx ON contact_leads(created_at DESC);
