

# Premium Apple Glass Hamburger Button

## Overview
Upgrade the hamburger/menu button in the mobile bottom nav to feel like a macOS Dock icon with frosted glass, lift animation, inner glow, and smooth transitions.

## Changes (single file)

**File: `src/components/dashboard/MobileBottomNav.tsx`**

1. Add `menuHovered` state for hover-driven styling
2. Convert the hamburger `<button>` to `<motion.button>` with spring-based `whileHover` (scale 1.07, y -1) and `whileTap` (scale 0.93)
3. Restyle inline `background`, `boxShadow`, `border`, and `transition` for both dark and light modes using the exact HSLA values specified -- much more translucent bases with brighter hover glows
4. Drive icon color from `menuHovered` state for a brighter icon on hover

No new files, no new dependencies, no database changes.

## Technical Details

| Property | Dark base | Dark hover | Light base | Light hover |
|----------|-----------|------------|------------|-------------|
| background | `hsla(215,35%,20%,0.45)` | `hsla(215,35%,30%,0.65)` | `hsla(0,0%,100%,0.50)` | `hsla(0,0%,100%,0.72)` |
| border | `hsla(0,0%,100%,0.10)` | `hsla(0,0%,100%,0.22)` | `hsla(0,0%,0%,0.08)` | `hsla(0,0%,0%,0.14)` |
| boxShadow | inset highlight + depth | + blue glow halo | inset highlight + depth | + blue glow halo |
| icon color | `hsla(0,0%,100%,0.45)` | `hsla(0,0%,100%,0.85)` | `hsl(215,14%,41%)` | `hsl(215,14%,20%)` |

Motion config: `whileHover={{ scale: 1.07, y: -1 }}`, `whileTap={{ scale: 0.93 }}`, spring stiffness 500 / damping 28.

When menu is open, existing blue accent styling is preserved and takes priority over hover states.

