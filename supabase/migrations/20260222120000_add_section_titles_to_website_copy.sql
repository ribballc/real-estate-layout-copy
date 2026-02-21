-- Optional section titles and microcopy for generated site (CMS-driven)
ALTER TABLE website_copy
ADD COLUMN IF NOT EXISTS section_titles jsonb DEFAULT '{}';

COMMENT ON COLUMN website_copy.section_titles IS 'Optional overrides for section headlines, e.g. {"section_services": "What we do best", "section_packages": "Pick your package"}';

-- Optional CMS-backed FAQ and Why Choose Us (arrays of { question, answer } or { title, description })
ALTER TABLE website_copy
ADD COLUMN IF NOT EXISTS faq_items jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS why_choose_us_items jsonb DEFAULT NULL;
