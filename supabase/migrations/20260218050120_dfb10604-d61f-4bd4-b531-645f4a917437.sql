
-- Feature flags table
CREATE TABLE public.feature_flags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name text NOT NULL UNIQUE,
  enabled_globally boolean NOT NULL DEFAULT false,
  enabled_for_user_ids uuid[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Anyone can read flags (needed for the hook)
CREATE POLICY "Anyone can read feature flags"
  ON public.feature_flags FOR SELECT USING (true);

-- Only admins can modify flags
CREATE POLICY "Admins can manage feature flags"
  ON public.feature_flags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add wants_custom_domain and soft-delete columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wants_custom_domain boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS account_deleted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Insert initial feature flags
INSERT INTO public.feature_flags (flag_name, enabled_globally, description) VALUES
  ('custom_domains', false, 'Allow businesses to use their own domain'),
  ('ai_copy_generation', false, 'AI-powered marketing copy generation'),
  ('google_reviews_integration', false, 'Pull and display Google Reviews'),
  ('calendar_sync', false, 'Sync bookings with Google/Apple Calendar'),
  ('team_members', false, 'Multi-user team accounts');

-- Trigger for updated_at on feature_flags
CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
