
-- Add slug column
ALTER TABLE public.profiles ADD COLUMN slug text UNIQUE;

-- Create a function to generate slug from business_name
CREATE OR REPLACE FUNCTION public.generate_profile_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Only generate slug if business_name changed or slug is null
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.business_name IS DISTINCT FROM NEW.business_name) THEN
    base_slug := lower(regexp_replace(trim(NEW.business_name), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    
    IF base_slug = '' THEN
      base_slug := 'business';
    END IF;
    
    final_slug := base_slug;
    LOOP
      -- Check if slug already exists (excluding current row)
      IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = final_slug AND id != NEW.id) THEN
        EXIT;
      END IF;
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER set_profile_slug
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_profile_slug();

-- Backfill existing profiles
UPDATE public.profiles SET slug = NULL WHERE slug IS NULL;
