

## Overview

This plan creates the complete booking-to-CRM pipeline: when a customer completes a booking on the public website, the system saves the booking to the database, creates/updates a customer record, and sends an automated email notification to the business owner. All data appears instantly in the dashboard Calendar and Customers sections.

## What Changes

### 1. Create the Checkout Page (`/site/:slug/book/checkout`)

A new page where the customer fills in their contact details (name, email, phone, vehicle info from previous steps, selected service/add-ons) and confirms the booking. On submit it:
- Resolves the business owner's `user_id` from the slug
- Inserts a row into the `bookings` table (with status "pending")
- Creates or updates a record in the `customers` table (upsert by email)
- Calls a new backend function to send the notification email
- Shows a success confirmation screen

### 2. Create a "send-booking-notification" Backend Function

A new backend function that sends an email to the business owner when a booking comes in. It will:
- Accept booking details (customer name, email, phone, service, date/time, price)
- Look up the business owner's email from the `profiles` table
- Send a formatted HTML email via Resend to the owner
- Optionally send an SMS via Twilio (reusing existing credentials from `send-contact-email`)

**Important:** This requires a Resend API key. You'll need to add a `RESEND_API_KEY` secret before this can work. The existing `send-contact-email` function already uses Resend, so you may already have it configured at the Supabase level -- but it's not showing in the current secrets list, so we'll need to add it.

### 3. Auto-create/Update Customer Records

When a booking is submitted, the checkout page will:
- Check if a customer with that email already exists for the business owner
- If yes: increment `total_bookings`, add to `total_spent`, update `last_service_date`
- If no: create a new customer with status "lead"

### 4. Pass Booking Context Through the Flow

Currently the booking steps don't carry forward the selected service, vehicle, add-ons, date, and time. We'll use URL search params (already partially in use) and `sessionStorage` to accumulate selections across steps so the checkout page has everything it needs.

---

## Technical Details

### New Files

| File | Purpose |
|------|---------|
| `src/pages/BookCheckout.tsx` | Checkout form page with contact fields and booking summary |
| `supabase/functions/send-booking-notification/index.ts` | Backend function to email the business owner |

### Modified Files

| File | Change |
|------|--------|
| `src/App.tsx` | Add `/site/:slug/book/checkout` route |
| `src/pages/BookBooking.tsx` | Store selected date/time in sessionStorage before navigating to checkout |
| `src/pages/Book.tsx` | Store selected service in sessionStorage |
| `src/pages/BookVehicle.tsx` | Store vehicle selection in sessionStorage |
| `src/pages/BookAddOns.tsx` | Store selected add-ons in sessionStorage |
| `supabase/config.toml` | Register the new backend function with `verify_jwt = false` |

### Secret Required

- **RESEND_API_KEY** -- needed to send emails via Resend. You'll be prompted to enter this.

### Checkout Page Flow

```text
Customer fills in:
  - Name, Email, Phone (required)
  - Any notes/message (optional)

Summary sidebar shows:
  - Selected service + price
  - Vehicle info
  - Add-ons + prices
  - Date & time
  - Total price

On "Confirm Booking":
  1. Resolve user_id from slug
  2. INSERT into bookings (user_id, customer info, service, date, time, price, status="pending")
  3. UPSERT into customers (create if new, update totals if existing)
  4. Call send-booking-notification function
  5. Show success confirmation with booking reference
```

### Backend Function: `send-booking-notification`

```text
POST /send-booking-notification
Body: {
  booking_id, owner_user_id,
  customer_name, customer_email, customer_phone,
  service_title, service_price, booking_date, booking_time,
  vehicle, addons, notes
}

Steps:
  1. Look up owner email from profiles table
  2. Send HTML email to owner via Resend with booking details
  3. Optionally send SMS via Twilio (if credentials exist)
  4. Return success/failure
```

### Database

No schema changes needed -- the existing `bookings` and `customers` tables already have all required columns. However, we need a public INSERT policy on `bookings` and `customers` so unauthenticated website visitors can create records. This will be scoped: the backend function (using service role) will handle the inserts instead, keeping the tables secure.

Since the backend function uses the service role key, it bypasses RLS entirely, so no new policies are needed. The checkout page will call the backend function rather than inserting directly from the client.

### Data Flow Diagram

```text
Public Booking Page (no auth)
  |
  v
BookCheckout.tsx
  |-- calls supabase.functions.invoke("send-booking-notification")
  |     |
  |     v
  |   Edge Function (service role)
  |     |-- INSERT into bookings
  |     |-- UPSERT into customers
  |     |-- Send email via Resend to owner
  |     |-- Send SMS via Twilio to owner (optional)
  |     |-- Return success
  |
  v
Success confirmation shown to customer
  |
  v
Dashboard Calendar + Customers auto-populated
```

