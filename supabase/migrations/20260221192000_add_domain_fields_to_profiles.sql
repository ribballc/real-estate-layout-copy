-- Add custom domain request and live domain fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS requested_domain text,
  ADD COLUMN IF NOT EXISTS domain_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS custom_domain text;

COMMENT ON COLUMN profiles.requested_domain IS 'Domain the user requested (e.g. mybusiness.com); admin purchases and then sets custom_domain';
COMMENT ON COLUMN profiles.domain_requested_at IS 'When the user submitted their domain request';
COMMENT ON COLUMN profiles.custom_domain IS 'Live custom domain after admin purchase and sync (e.g. www.mybusiness.com)';
