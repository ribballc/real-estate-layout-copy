-- Optional custom hero background image URL for generated site
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS hero_background_url text DEFAULT NULL;
