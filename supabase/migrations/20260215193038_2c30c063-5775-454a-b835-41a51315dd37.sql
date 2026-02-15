
-- Add image_url columns to services and add_ons
ALTER TABLE public.services ADD COLUMN image_url text DEFAULT NULL;
ALTER TABLE public.add_ons ADD COLUMN image_url text DEFAULT NULL;
