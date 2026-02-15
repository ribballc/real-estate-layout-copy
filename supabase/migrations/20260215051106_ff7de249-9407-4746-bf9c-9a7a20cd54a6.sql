
-- Add service_areas column and no_business_address flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS service_areas text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS no_business_address boolean DEFAULT false;
