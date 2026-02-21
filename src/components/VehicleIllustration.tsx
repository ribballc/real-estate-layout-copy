/**
 * Polished SVG vehicle illustration for booking flow.
 * Used instead of third-party images to avoid watermarks; same look on all devices.
 */
interface VehicleIllustrationProps {
  className?: string;
  /** Fill color for body (default grey) */
  bodyColor?: string;
}

export default function VehicleIllustration({ className, bodyColor = "hsl(210,20%,88%)" }: VehicleIllustrationProps) {
  return (
    <svg
      viewBox="0 0 420 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Body shadow */}
      <path
        d="M45 132c0-4 4-12 28-20 22-7 52-10 88-8 38 2 72 10 98 20 22 9 38 18 45 24v12H45v-28z"
        fill="hsl(210,20%,78%)"
        opacity={0.4}
      />
      {/* Main body */}
      <path
        d="M52 128c0-6 6-16 32-24 24-7 56-10 94-8 40 2 76 11 102 22 22 9 36 18 42 24v16H52v-30z"
        fill={bodyColor}
        stroke="hsl(210,15%,75%)"
        strokeWidth={1.2}
      />
      {/* Roof/window line */}
      <path
        d="M95 104c0-2 8-8 32-12 22-4 52-4 86 0 32 4 58 10 64 14v8H95v-10z"
        fill="hsl(210,25%,72%)"
        stroke="hsl(210,15%,70%)"
        strokeWidth={0.8}
      />
      {/* Windshield */}
      <path
        d="M108 100h80v14H108z"
        fill="hsl(210,30%,82%)"
        opacity={0.9}
      />
      {/* Rear window */}
      <path
        d="M188 100h72v14H188z"
        fill="hsl(210,28%,78%)"
        opacity={0.85}
      />
      {/* Wheel wells */}
      <ellipse cx="128" cy="138" rx="22" ry="10" fill="hsl(210,15%,45%)" />
      <ellipse cx="292" cy="138" rx="22" ry="10" fill="hsl(210,15%,45%)" />
      {/* Wheels */}
      <circle cx="128" cy="138" r="16" fill="hsl(210,10%,35%)" stroke="hsl(210,10%,28%)" strokeWidth={2} />
      <circle cx="128" cy="138" r="8" fill="hsl(210,15%,55%)" />
      <circle cx="292" cy="138" r="16" fill="hsl(210,10%,35%)" stroke="hsl(210,10%,28%)" strokeWidth={2} />
      <circle cx="292" cy="138" r="8" fill="hsl(210,15%,55%)" />
      {/* Headlight */}
      <ellipse cx="355" cy="118" rx="6" ry="4" fill="hsl(45,80%,75%)" opacity={0.95} />
      {/* Grille hint */}
      <path d="M340 122h12v4h-12z" fill="hsl(210,15%,40%)" opacity={0.8} />
    </svg>
  );
}
