
-- Add SMS consent flag to profiles
ALTER TABLE public.profiles ADD COLUMN sms_consent boolean NOT NULL DEFAULT false;

-- Retention SMS tracking table (event-log pattern, matches user_emails_sent)
CREATE TABLE public.trial_retention_sms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  step integer NOT NULL CHECK (step >= 1 AND step <= 3),
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  phone text NOT NULL DEFAULT '',
  is_test boolean NOT NULL DEFAULT false,
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_retention_sms ENABLE ROW LEVEL SECURITY;

-- Only admins can access this table
CREATE POLICY "Admins full access retention sms"
ON public.trial_retention_sms
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Index for quick lookups by user
CREATE INDEX idx_trial_retention_sms_user_id ON public.trial_retention_sms (user_id);
