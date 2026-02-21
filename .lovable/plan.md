

# Bury "Delete Account" 3 Clicks Deep

## What changes

**Single file:** `src/components/dashboard/AccountSettings.tsx`

No logic changes -- `handleDeleteAccount`, the Supabase call, `deleteConfirm === "DELETE"` guard, and all state around `deleting` remain identical.

## The three layers

### Layer 1 -- Footnote link (always visible)
A barely-visible button at the very bottom of the settings list, below the Setup Guide card:
- Text: `account & data preferences ->`
- Styled `text-white/25 text-xs` -- no border, no background, no icon
- Toggles new `showDataPrefs` state

### Layer 2 -- "Data Management" card (visible when `showDataPrefs` is true)
A plain `dash-card` with no alarming styling. Three rows:

| Left label | Right value |
|---|---|
| Account created | `user?.created_at` formatted via `new Date().toLocaleDateString(...)` (e.g. "Jan 5, 2025") |
| Account status | "Active" in dim text |
| Account closure | A small `Manage ->` link (`text-white/40 text-xs hover:text-white/60`) that toggles new `showDeleteFlow` state |

### Layer 3 -- Inline delete flow (visible when both states are true)
Expands inside the same Data Management card (no new card, no red border):
- Warning paragraph styled `text-white/50 text-sm` (same copy, no icon)
- Existing type-DELETE `Input` field (restyled without red border -- uses `border-white/10` instead)
- "Close Account" ghost `Button` at low contrast, only becoming visually active when `deleteConfirm === "DELETE"` -- wired to existing `handleDeleteAccount`

## Other changes
- Remove the entire red-bordered Delete Account card (lines 319-350)
- Remove `AlertTriangle` and `Trash2` from the lucide-react import (no longer used)
- Add two new boolean states: `showDataPrefs`, `showDeleteFlow`

## Technical detail

New state declarations (next to existing state):
```tsx
const [showDataPrefs, setShowDataPrefs] = useState(false);
const [showDeleteFlow, setShowDeleteFlow] = useState(false);
```

The formatted date uses:
```tsx
new Date(user?.created_at ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
```

The "Close Account" button uses the same conditional styling pattern as the old delete button but with ghost/muted colors instead of red, only activating when the user types DELETE.

