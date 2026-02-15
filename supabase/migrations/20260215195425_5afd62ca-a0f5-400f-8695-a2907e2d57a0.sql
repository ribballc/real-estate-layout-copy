
-- Service option groups (e.g. "Select Tint Type", "Window Positions", "Tint Percentage")
CREATE TABLE public.service_option_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  option_type TEXT NOT NULL DEFAULT 'checkbox', -- 'checkbox' (multi-select), 'radio' (single-select), 'slider'
  sort_order INT NOT NULL DEFAULT 0,
  required BOOLEAN NOT NULL DEFAULT false,
  -- Slider-specific config
  slider_min INT DEFAULT 0,
  slider_max INT DEFAULT 100,
  slider_step INT DEFAULT 5,
  slider_unit TEXT DEFAULT '%',
  slider_default INT DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual options within a group (for checkbox/radio types)
CREATE TABLE public.service_option_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.service_option_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price_modifier NUMERIC NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_option_items ENABLE ROW LEVEL SECURITY;

-- RLS for service_option_groups
CREATE POLICY "Anyone can view option groups" ON public.service_option_groups FOR SELECT USING (true);
CREATE POLICY "Users can insert own option groups" ON public.service_option_groups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own option groups" ON public.service_option_groups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own option groups" ON public.service_option_groups FOR DELETE USING (auth.uid() = user_id);

-- RLS for service_option_items
CREATE POLICY "Anyone can view option items" ON public.service_option_items FOR SELECT USING (true);
CREATE POLICY "Users can insert own option items" ON public.service_option_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own option items" ON public.service_option_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own option items" ON public.service_option_items FOR DELETE USING (auth.uid() = user_id);

-- Timestamp trigger for option groups
CREATE TRIGGER update_service_option_groups_updated_at
  BEFORE UPDATE ON public.service_option_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
