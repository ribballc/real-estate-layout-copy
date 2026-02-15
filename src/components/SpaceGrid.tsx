/**
 * SpaceGrid — infinite-depth perspective grid overlay.
 * Place behind section content with `position: relative; z-10` on inner wrappers.
 */
const SpaceGrid = ({ opacity = 0.035 }: { opacity?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Perspective grid — vanishing point */}
    <div
      className="absolute inset-0"
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(hsla(217, 91%, 60%, 0.4) 1px, transparent 1px),
          linear-gradient(90deg, hsla(217, 91%, 60%, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 100%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 100%, black 0%, transparent 70%)',
        transform: 'perspective(500px) rotateX(45deg)',
        transformOrigin: 'center bottom',
      }}
    />

    {/* Subtle horizontal scan lines */}
    <div
      className="absolute inset-0"
      style={{
        opacity: opacity * 0.5,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(217, 91%, 60%, 0.08) 2px, hsla(217, 91%, 60%, 0.08) 3px)',
        backgroundSize: '100% 6px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)',
      }}
    />

    {/* Horizon glow */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[40%]"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, hsla(217, 91%, 60%, 0.06) 0%, transparent 70%)',
      }}
    />
  </div>
);

export default SpaceGrid;
