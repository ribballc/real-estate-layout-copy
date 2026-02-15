

# Login, Signup, and User Dashboard

## Overview

This plan adds authentication (email/password + Google) and a full dashboard where each paying user can manage their booking page content -- services, hours, logo, social media, add-ons, pricing, photos, testimonials, and more.

## Prerequisites

Before any code is written, we need to **enable Lovable Cloud** on this project. This gives us:
- **Authentication** (email/password + Google sign-in)
- **Database** (to store each user's business profile, services, add-ons, hours, etc.)
- **Storage** (for logos and photos)

You'll be prompted to enable Cloud when implementation begins.

---

## What Gets Built

### 1. Authentication Pages

**`/login` page** matching your existing dark/blue UI:
- Email + password login form
- "Sign in with Google" button
- Link to sign up
- Centered card layout with the Velarrio brand header

**`/signup` page** (same styling):
- Name, email, password fields
- "Sign up with Google" button
- Link to login

Both pages will use the same dark gradient card style used throughout the booking flow.

### 2. Database Tables

The following tables will be created to store each user's customizable booking page data:

- **profiles** -- business name, tagline, email, phone, address, logo URL, social media links
- **user_roles** -- role-based access (admin, user) in a separate table for security
- **services** -- each user's service offerings (title, description, price, popular flag)
- **add_ons** -- add-on upsells linked to services
- **business_hours** -- day-of-week hours for each user
- **testimonials** -- customer testimonials/reviews
- **photos** -- gallery photos (URLs stored, files in storage)

All tables have Row-Level Security so users can only see/edit their own data.

### 3. Dashboard (`/dashboard`)

A sidebar-navigation dashboard with these sections:

| Section | What Users Edit |
|---------|----------------|
| **Business Info** | Name, tagline, email, phone, address, map query, logo upload |
| **Social Media** | Instagram, Facebook, TikTok, YouTube, Google Business links |
| **Services** | Add/edit/delete service cards (title, description, price) |
| **Add-ons** | Manage add-on upsells per service |
| **Hours** | Set open/close times per day of the week |
| **Pricing** | Base prices, package pricing |
| **Photos** | Upload/manage gallery photos |
| **Testimonials** | Add/edit customer reviews |
| **Account** | Change password, manage subscription |

### 4. Protected Routes

- `/dashboard/*` routes require authentication
- Unauthenticated users are redirected to `/login`
- After login, users land on `/dashboard`

---

## Technical Details

### Auth Implementation
- Supabase Auth via Lovable Cloud
- `onAuthStateChange` listener set up before `getSession()` call
- Auth context provider wrapping the app
- Google OAuth configured through Cloud dashboard

### Database Schema (simplified)

```text
profiles
  id (uuid, FK -> auth.users)
  business_name, tagline, email, phone
  address, map_query
  logo_url
  instagram, facebook, tiktok, youtube, google_business

user_roles
  id, user_id (FK -> auth.users), role (enum)

services
  id, user_id, title, description, price, popular, sort_order

add_ons
  id, service_id (FK -> services), user_id
  title, description, price, popular, sort_order

business_hours
  id, user_id, day_of_week, open_time, close_time, is_closed

testimonials
  id, user_id, author, content, rating

photos
  id, user_id, url, caption, sort_order
```

### RLS Policies
- Every table gets `SELECT/INSERT/UPDATE/DELETE` policies scoped to `auth.uid() = user_id`
- Trigger auto-creates a profile row on signup
- `has_role()` security definer function for role checks

### Dashboard UI
- Uses the same design system (Inter font, blue accent, card borders, FadeIn animations)
- Sidebar navigation on desktop, bottom tabs or hamburger on mobile
- Forms use react-hook-form + zod validation (already installed)
- Toast notifications for save/error feedback (already installed)

### File Structure (new files)
```text
src/contexts/AuthContext.tsx
src/components/ProtectedRoute.tsx
src/pages/Login.tsx
src/pages/Signup.tsx
src/pages/Dashboard.tsx
src/components/dashboard/DashboardLayout.tsx
src/components/dashboard/DashboardSidebar.tsx
src/components/dashboard/BusinessInfoForm.tsx
src/components/dashboard/SocialMediaForm.tsx
src/components/dashboard/ServicesManager.tsx
src/components/dashboard/AddOnsManager.tsx
src/components/dashboard/HoursManager.tsx
src/components/dashboard/PhotosManager.tsx
src/components/dashboard/TestimonialsManager.tsx
src/components/dashboard/AccountSettings.tsx
```

---

## Implementation Order

1. Enable Lovable Cloud
2. Set up database tables + RLS policies + triggers
3. Create auth context and protected route components
4. Build login and signup pages
5. Build dashboard layout with sidebar navigation
6. Build each dashboard section one at a time (Business Info first, then Services, Add-ons, Hours, etc.)
7. Wire the booking pages to read from the database instead of hardcoded data (future step)

