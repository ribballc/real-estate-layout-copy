

## Overview

Your auth and CMS data are **already saving to your backend database** -- every field in Business Info, Services, Hours, Testimonials, Photos, and Customers writes to the database when you hit Save. The missing piece is making that data **readable by your other project** (the public-facing website). Right now, all tables are locked so only the logged-in owner can see their own data.

This plan will:
1. Open up **read-only public access** on the relevant CMS tables so the other project can fetch the data
2. Create a **backend function** that bundles all CMS data for a business into a single API call
3. Replace the **hardcoded data** in the booking pages and sidebar with live database data

---

## What Changes

### 1. Add Public Read Policies to CMS Tables

Add `SELECT` policies allowing anonymous (public) reads for these tables:
- `profiles` (business name, tagline, email, phone, address, logo, colors, social links)
- `services` (title, description, price, image, popularity)
- `business_hours` (open/close times per day)
- `testimonials` (author, content, rating, photo)
- `photos` (url, caption)
- `service_option_groups` and `service_option_items` (already have public read)

The existing owner-only policies stay in place for INSERT/UPDATE/DELETE -- only SELECT gets a public policy.

### 2. Create a "get-business" Backend Function

A single API endpoint that accepts a `user_id` (or a future `slug` parameter) and returns all CMS data in one response:

```text
GET /get-business?user_id=xxx

Response:
{
  profile: { business_name, tagline, email, phone, address, ... },
  services: [...],
  hours: [...],
  testimonials: [...],
  photos: [...],
  addOns: [...]
}
```

This makes it easy for the other Lovable project to fetch everything with a single call.

### 3. Replace Hardcoded Booking Page Data

Update these files to fetch from the database instead of using hardcoded arrays:

- **BookingSidebar.tsx** -- Replace the hardcoded `businessInfo` object and `tickerServices` with data fetched from `profiles`, `services`, and `business_hours`
- **Book.tsx** -- Replace the hardcoded `services` array with a database query
- **BookingLayout.tsx** -- Pass the fetched business data down to child components

These pages are public-facing (no login required), so they'll use the new public read policies.

---

## Technical Details

### Database Migration (SQL)

```sql
-- Public read on profiles (excludes sensitive auth data since profiles only has business info)
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
```

### Backend Function: `get-business`

- Accepts `user_id` query parameter
- Uses Supabase service role client to fetch all CMS tables for that user
- Returns combined JSON payload
- No auth required (public endpoint)

### Frontend Changes

- **BookingSidebar.tsx**: Accept `userId` prop, fetch `profiles` + `services` + `business_hours` on mount, render dynamically
- **Book.tsx**: Accept `userId` from URL or context, fetch `services` from database
- **BookingLayout.tsx**: Coordinate data fetching and pass down to sidebar/content

### How Your Other Project Uses This

Your other Lovable project simply calls the backend function with the business owner's user ID:

```typescript
const response = await fetch(
  "https://ibospodoxgumgmjymgtm.supabase.co/functions/v1/get-business?user_id=USER_ID_HERE"
);
const data = await response.json();
// Use data.profile, data.services, data.hours, etc.
```

---

## File Summary

| File | Action |
|------|--------|
| Database migration | Add 6 public SELECT policies |
| `supabase/functions/get-business/index.ts` | New backend function |
| `src/components/BookingSidebar.tsx` | Fetch from DB instead of hardcoded |
| `src/pages/Book.tsx` | Fetch services from DB |
| `src/components/BookingLayout.tsx` | Add data fetching coordination |

