
# Fix: Blank Screen When Clicking "Start Free Trial"

## Problem
When you click "Start My Free Trial" in the upgrade modal, the page goes completely blank/white. This happens because `window.location.href` tries to redirect the current page to Stripe's checkout URL. Inside embedded/iframe environments this causes a white screen, and even on production it navigates users away from the dashboard entirely.

## Solution
Open Stripe Checkout in a new browser tab instead of redirecting the current page. This:
- Eliminates the blank screen issue
- Keeps your dashboard open in the background
- When you return from Stripe, the subscription status auto-refreshes (already wired up via the `useSubscription` hook's window focus listener)

## Changes

### 1. UpgradeModal.tsx -- Open checkout in new tab
Replace `window.location.href = data.url` with `window.open(data.url, '_blank')`. After opening, close the modal and reset loading state so the dashboard stays usable.

### 2. DashboardLayout.tsx -- Improve post-checkout refresh
The `?checkout=success` handler already exists and works. The window-focus auto-refresh in `useSubscription` will also detect the new subscription when the user returns from the Stripe tab. Add a success toast when subscription becomes active after a focus-refresh (currently only fires on the `?checkout=success` param).

## Technical Details
- **File**: `src/components/dashboard/UpgradeModal.tsx` (line 149-151)
  - Change `window.location.href = data.url` to `window.open(data.url, '_blank')`
  - After opening, call `closeUpgradeModal()` so the user sees their dashboard
  - Keep loading=false in finally block

- **File**: `src/components/dashboard/DashboardLayout.tsx` -- no changes needed; the existing `useSubscription` hook already refreshes on window focus, so when the user completes Stripe checkout and switches back to the dashboard tab, the subscription status will update automatically.
