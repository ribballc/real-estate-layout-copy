

# Show Real Car Image After Selection

## What Changes
When a user selects all three fields (Year, Make, Model) on `/book/vehicle`, the generic car silhouette SVG will be replaced with a photo-realistic render of their exact vehicle, fetched from the free **imagin.studio** Car Image API.

## How It Works
- The API generates car images from a URL like:
  `https://cdn.imagin.studio/getimage?customer=hrjavascript-masede&make=BMW&modelFamily=3+Series&modelYear=2024&angle=01`
- No API key is needed for the free tier (uses a shared demo key)
- The image renders a realistic 3/4 angle view of the specified vehicle

## User Experience
1. **Before selection**: The current faded car silhouette SVG and "Use the categories on the left..." text remain as-is
2. **After selecting Year + Make + Model**: The silhouette fades out and the real car image fades in with a smooth scale-up animation
3. **Vehicle label**: The selected Year, Make, and Model appear as text below the image (e.g., "2024 BMW 3 Series")
4. **Error handling**: If the image fails to load (network issue or unsupported model), it falls back to the silhouette with no broken image shown

## Visual Treatment
- The car image will have a subtle blue glow/shadow underneath to match the dark theme
- Smooth transition animation (fade + scale from 0.95 to 1.0, 0.5s)
- Maintains the same container size and centering as the current silhouette

## Technical Details

### File: `src/pages/BookVehicle.tsx`

**Changes:**
- Build the imagin.studio URL from the `year`, `make`, and `model` state using `useMemo`
- Add an `imageLoaded` state (`useState<boolean>(false)`) to track successful loads
- Add an `imageError` state to handle fallback
- Replace the right-side content block with conditional rendering:
  - If `canContinue && imageLoaded`: show the car image with label
  - Otherwise: show the existing SVG silhouette
- The `<img>` tag will use `onLoad` to set `imageLoaded=true` and `onError` to set `imageError=true`
- Reset `imageLoaded` and `imageError` whenever year/make/model changes
- The model value is URL-encoded for models with spaces (e.g., "3 Series" becomes "3+Series")

No new files, no new dependencies -- just a simple `<img>` tag with the free API URL.

