
-- Add onboarding and trial tracking to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_active boolean NOT NULL DEFAULT false;
