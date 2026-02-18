
-- Table for cancel flow reasons
CREATE TABLE public.churn_reasons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reason text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  offer_shown text NOT NULL DEFAULT '',
  offer_accepted boolean NOT NULL DEFAULT false,
  canceled_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.churn_reasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own churn reasons"
  ON public.churn_reasons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own churn reasons"
  ON public.churn_reasons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access churn reasons"
  ON public.churn_reasons FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Table for feature requests from cancel flow
CREATE TABLE public.feature_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feature requests"
  ON public.feature_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feature requests"
  ON public.feature_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feature requests"
  ON public.feature_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add churn_risk and weekly summary tracking to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS churn_risk boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_weekly_summary_shown_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;

-- Enable realtime for bookings so activity feed works
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
