

# Replicate "Deluxe Detailing" Layout in Demo Website

## Overview
Rebuild `DemoWebsite.tsx` to match the full structure and styling of the uploaded "Deluxe Detailing" reference site, while keeping all dynamic data (business name, services, reviews, photos, hours) pulled from the user's CMS.

## What Changes

### 1. Add Missing Sections to Home Page
The current demo site has: Hero, Welcome, Services, Why Choose Us, Gallery, Reviews, CTA, Footer. The reference adds:
- **Add-On Services section** -- pulls from the user's existing add-ons data (if available) or services marked as add-ons
- **FAQ section** -- with accordion-style expand/collapse using Plus/Minus icons and gold gradient toggle buttons
- **Contact Form section** -- a two-column layout with contact info (phone, email, hours, social links) on the left and a booking form on the right

### 2. Enhance Existing Sections to Match Reference Styling
- **Services/Packages**: Add vehicle type tabs (Sedan vs Truck/SUV) if the user has categorized services, add feature checklists with checkmark icons, and badge labels ("TOP SELLER", etc.) for popular services
- **Why Choose Us**: Expand from 3 to 6 feature cards with gold-gradient icon containers matching the reference (Shield, Clock, Award, Sparkles, ThumbsUp, Car icons)
- **Gallery**: Replace static grid with an auto-scrolling Embla carousel (already installed as `embla-carousel-react`) showing 4 items on desktop with hover overlay effects
- **Testimonials**: Add Quote icon watermark in each card, vehicle info line under author name, border-top separator styling

### 3. Styling Refinements
- Add `card-shine` hover effect CSS (a subtle shimmer on card hover)
- Use `gold-gradient` utility for icon containers (maps to the user's accent color gradient)
- Consistent section pattern: uppercase tracking-wide label, large bold heading with gradient text, muted description
- Contact form inputs: styled with secondary background, border, rounded-lg, focus:border-primary

## Section Order (Home Page)
1. Hero (existing, no changes needed)
2. Welcome/About (existing, minor copy tweak)
3. Services Overview -- image cards linking to packages (new)
4. Packages/Pricing (enhanced with tabs + checklists)
5. Add-On Services (new section)
6. Why Choose Us (expanded to 6 cards)
7. Gallery (carousel instead of grid)
8. Testimonials (enhanced with Quote icon + vehicle info)
9. FAQ (new section)
10. Contact Form (new two-column section)
11. CTA Banner (existing)
12. Footer (existing, no changes needed)

## Technical Details

### File Modified
- `src/components/dashboard/DemoWebsite.tsx` -- single file rewrite incorporating all new sections

### New CSS Utilities (added inline via style props)
- Card shine effect via CSS pseudo-element or subtle box-shadow on hover
- Gold gradient backgrounds using the existing `accentGrad` variable
- All styling remains dynamic, using the user's chosen accent color

### Data Sources (all existing, no new tables needed)
- `profiles` -- business info, social links, phone, email
- `services` -- packages and pricing  
- `testimonials` -- reviews with author and rating
- `photos` -- gallery images
- `business_hours` -- hours for contact section and booking

### Gallery Carousel
- Uses `embla-carousel-react` (already installed) for auto-scrolling gallery
- 4 items visible on desktop, 2 on tablet, 1 on mobile
- Auto-advances every 3 seconds with loop enabled

### FAQ Data
- Hardcoded default FAQ questions relevant to detailing (matching reference) since there's no FAQ table
- Questions dynamically reference the business name via the `biz` variable

### Contact Form
- Display-only within the demo preview (not functional submission)
- Shows phone, email, hours from profile data
- Shows social media links from profile data
- Form fields: name, email, phone, vehicle, address, service selection checkboxes, add-on checkboxes, message textarea
- "Book Now" button styled with accent gradient

