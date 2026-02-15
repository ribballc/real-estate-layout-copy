

# Show Google Maps Embed on All Booking Pages

## What Changes
The Google Maps embed will be visible below the Location section in the sidebar on **both** `/book` and `/book/vehicle` pages (and any future booking steps). Right now, only `/book/vehicle` shows the map because `/book` doesn't pass `showMap`.

## Changes

### 1. `src/pages/Book.tsx`
- Add `showMap` prop to `<BookingLayout activeStep={0}>` so it becomes `<BookingLayout activeStep={0} showMap>`

### 2. `src/components/BookingSidebar.tsx`
- Remove the conditional `{showMap && ...}` wrapper so the map **always** renders below the address
- Remove the `showMap` prop from the component interface entirely (it's no longer needed)
- This keeps it simple: the map is always part of the sidebar

### 3. `src/components/BookingLayout.tsx`
- Remove the `showMap` prop from the interface and stop passing it to `BookingSidebar`

This is a 3-file, ~10-line change. The map iframe is already implemented with the correct address from the CMS config -- it just needs to always be shown.

