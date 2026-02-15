
-- Add photo_url to testimonials for reviewer photos
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS photo_url text DEFAULT '';

-- Add business brand colors to profiles (CMS-ready)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#3B82F6';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#1E3A5F';
