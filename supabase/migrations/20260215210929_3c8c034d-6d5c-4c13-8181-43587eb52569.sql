-- Create blocked_days table for "Out of Work" days
CREATE TABLE public.blocked_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  blocked_date DATE NOT NULL,
  reason TEXT NOT NULL DEFAULT 'Out of Work',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_days ENABLE ROW LEVEL SECURITY;

-- Unique constraint to prevent duplicate blocks
CREATE UNIQUE INDEX idx_blocked_days_user_date ON public.blocked_days(user_id, blocked_date);

-- RLS policies
CREATE POLICY "Users can view own blocked days" ON public.blocked_days FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own blocked days" ON public.blocked_days FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own blocked days" ON public.blocked_days FOR DELETE USING (auth.uid() = user_id);

-- Public read access for booking flow (anyone booking needs to see blocked days)
CREATE POLICY "Anyone can view blocked days for booking" ON public.blocked_days FOR SELECT USING (true);
