
-- Public read on profiles
CREATE POLICY "Anyone can view profiles for public site"
  ON public.profiles FOR SELECT USING (true);

-- Public read on services
CREATE POLICY "Anyone can view services for booking"
  ON public.services FOR SELECT USING (true);

-- Public read on business_hours
CREATE POLICY "Anyone can view business hours"
  ON public.business_hours FOR SELECT USING (true);

-- Public read on testimonials
CREATE POLICY "Anyone can view testimonials"
  ON public.testimonials FOR SELECT USING (true);

-- Public read on photos
CREATE POLICY "Anyone can view photos"
  ON public.photos FOR SELECT USING (true);

-- Public read on add_ons
CREATE POLICY "Anyone can view add_ons for booking"
  ON public.add_ons FOR SELECT USING (true);
