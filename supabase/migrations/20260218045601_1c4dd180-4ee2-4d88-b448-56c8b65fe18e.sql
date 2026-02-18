
-- Error logging table for ErrorBoundary
CREATE TABLE public.error_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  error_message text NOT NULL DEFAULT '',
  stack_trace text NOT NULL DEFAULT '',
  page_url text NOT NULL DEFAULT '',
  occurred_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (errors may happen before auth loads)
CREATE POLICY "Anyone can insert error logs"
ON public.error_logs FOR INSERT
WITH CHECK (true);

-- Only admins can read error logs
CREATE POLICY "Admins can view error logs"
ON public.error_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Rate limiting table for public edge functions
CREATE TABLE public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  endpoint text NOT NULL DEFAULT '',
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No client access — only service role from edge functions
CREATE POLICY "No public access to rate_limits"
ON public.rate_limits FOR ALL
USING (false);

-- Index for fast IP+endpoint lookups
CREATE INDEX idx_rate_limits_ip_endpoint ON public.rate_limits (ip_address, endpoint, window_start);

-- Auto-cleanup old rate limit entries (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 hour';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_cleanup_rate_limits
AFTER INSERT ON public.rate_limits
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_rate_limits();
