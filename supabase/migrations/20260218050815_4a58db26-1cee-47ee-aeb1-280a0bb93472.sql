
-- Website copy table for AI-generated content
CREATE TABLE public.website_copy (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  hero_headline text NOT NULL DEFAULT '',
  hero_subheadline text NOT NULL DEFAULT '',
  about_paragraph text NOT NULL DEFAULT '',
  services_descriptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_meta_description text NOT NULL DEFAULT '',
  cta_tagline text NOT NULL DEFAULT '',
  hero_headline_edited boolean NOT NULL DEFAULT false,
  hero_subheadline_edited boolean NOT NULL DEFAULT false,
  about_paragraph_edited boolean NOT NULL DEFAULT false,
  services_descriptions_edited boolean NOT NULL DEFAULT false,
  seo_meta_description_edited boolean NOT NULL DEFAULT false,
  cta_tagline_edited boolean NOT NULL DEFAULT false,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT website_copy_user_id_key UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.website_copy ENABLE ROW LEVEL SECURITY;

-- Users can view their own copy
CREATE POLICY "Users can view own website copy"
  ON public.website_copy FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own copy
CREATE POLICY "Users can insert own website copy"
  ON public.website_copy FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own copy
CREATE POLICY "Users can update own website copy"
  ON public.website_copy FOR UPDATE
  USING (auth.uid() = user_id);

-- Public read for live site rendering
CREATE POLICY "Anyone can view website copy for public site"
  ON public.website_copy FOR SELECT
  USING (true);

-- Timestamp trigger
CREATE TRIGGER update_website_copy_updated_at
  BEFORE UPDATE ON public.website_copy
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
