
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fbc TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fbp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS acquisition_landing_url TEXT;
