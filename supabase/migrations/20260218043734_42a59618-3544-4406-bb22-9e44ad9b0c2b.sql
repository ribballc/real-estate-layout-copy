
-- Add unsubscribe flag to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS unsubscribed_from_emails boolean NOT NULL DEFAULT false;

-- Create email tracking table
CREATE TABLE public.user_emails_sent (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email_type text NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone
);

-- Index for fast lookups
CREATE INDEX idx_user_emails_sent_user_type ON public.user_emails_sent (user_id, email_type);
CREATE INDEX idx_user_emails_sent_sent_at ON public.user_emails_sent (sent_at);

-- Enable RLS
ALTER TABLE public.user_emails_sent ENABLE ROW LEVEL SECURITY;

-- Only service role should write to this table (from edge functions)
-- Users can view their own email history
CREATE POLICY "Users can view own email history"
ON public.user_emails_sent
FOR SELECT
USING (auth.uid() = user_id);
