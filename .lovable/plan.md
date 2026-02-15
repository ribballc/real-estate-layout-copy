

# Fix Vehicle Image: Replace Covered Car with Reliable Solution

## The Problem
The imagin.studio free demo key (`hrjavascript-masede`) returns a red-draped "covered car" image for many vehicle combinations instead of an actual render. There's no way to detect this programmatically since the API returns a 200 OK status with a valid image -- it's just a covered car.

## The Fix
Switch to a more reliable free car image source and add a detection fallback:

### Option: Use the **logo + styled silhouette** approach
Since no free car image API reliably covers all year/make/model combos without a paid key, the best approach is:

1. **Show the vehicle make's logo** fetched from a reliable free source (e.g., `https://www.carlogos.org/` or similar CDN)
2. **Keep the stylized SVG silhouette** but enhance it with the selected vehicle info displayed prominently
3. **Attempt the imagin.studio image** but detect the red-covered fallback by checking the dominant color of the loaded image using a small canvas check -- if it's predominantly red/brown, treat it as an error and fall back to the logo + silhouette

### Changes to `src/pages/BookVehicle.tsx`:
- Add a canvas-based color check in the `onLoad` handler: draw the image to a tiny canvas, sample pixels, and if the dominant color is in the red/brown range, set `imageError = true`
- Update the fallback display to show the make logo + vehicle name in a more polished card layout instead of just the generic silhouette
- Use the logo URL pattern: `https://www.carlogos.org/car-logos/${make.toLowerCase()}-logo.png` or keep a small local map of SVG logos for the top makes

### Fallback display (when image fails or shows covered car):
- Show the existing car silhouette SVG at slightly higher opacity (30%)
- Overlay the vehicle name in larger text: "2016 Chevrolet Corvette"
- Add a subtle badge: "Vehicle selected" with a checkmark
- This still looks polished and confirms the user's selection visually

## Technical Detail

The canvas pixel-sampling approach:
```
onLoad handler:
1. Draw loaded image to a 1x1 canvas (averages all pixels)
2. Read the single pixel's RGB values
3. If R > 150 && G < 100 && B < 100 → it's the red cover → set imageError(true)
4. Otherwise → show the real image
```

This is lightweight (no dependencies) and catches the red-draped fallback reliably.

## Files Modified
- `src/pages/BookVehicle.tsx` -- add canvas color detection logic and enhanced fallback UI

