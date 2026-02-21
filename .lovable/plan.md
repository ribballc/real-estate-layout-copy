

# Fix: Car Image Not Displaying on Vehicle Selector

## Problem
The car image from Imagin Studio never renders -- users only see the ghost car outline on all devices. Two bugs are causing this:

1. **CORS failure**: The hidden preload `<img>` tag has `crossOrigin="anonymous"`, which requires the Imagin Studio CDN to send `Access-Control-Allow-Origin` headers. It likely does not, causing the image to fail loading entirely on most browsers.

2. **Fragile canvas pixel-check**: Even if the image loads, the code draws it to a canvas and calls `getImageData()` to detect placeholder images. With `crossOrigin` set, this taints the canvas and throws a security error. The empty `catch {}` silently swallows the error, but `setImageLoaded(true)` is never reached in the error path.

## Solution

### File: `src/pages/BookVehicle.tsx`

**Step 1 -- Remove `crossOrigin` and the canvas pixel-check entirely**
- Remove `crossOrigin="anonymous"` from the hidden preload image
- Replace the canvas-based placeholder detection with a simpler `naturalWidth`/`naturalHeight` check (placeholder images from the API are typically very small, like 1x1)
- This eliminates all CORS issues

**Step 2 -- Simplify the image load handler**
```tsx
const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  // Imagin Studio returns a tiny placeholder when no image exists
  if (img.naturalWidth < 50 || img.naturalHeight < 50) {
    setImageError(true);
    return;
  }
  setImageLoaded(true);
  requestAnimationFrame(() => setShowImage(true));
}, []);
```

**Step 3 -- Remove `crossOrigin` from the preload img tag (line 86)**
Change:
```tsx
<img key={imageKey.current} src={carImageUrl} alt="" crossOrigin="anonymous" onLoad={handleImageLoad} onError={() => setImageError(true)} className="hidden" />
```
To:
```tsx
<img key={imageKey.current} src={carImageUrl} alt="" onLoad={handleImageLoad} onError={() => setImageError(true)} className="hidden" />
```

These two changes fix the image on all devices -- desktop, mobile, and embedded previews.

## Technical Details

| What | Before | After |
|------|--------|-------|
| `crossOrigin` attr | `"anonymous"` (causes CORS block) | Removed |
| Placeholder detection | Canvas pixel sampling (CORS-dependent) | `naturalWidth`/`naturalHeight` size check |
| Error handling | Silent `catch {}` swallows failures | Clean boolean check, no canvas needed |
| Device compatibility | Broken on all devices | Works everywhere |

