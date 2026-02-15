import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const outline = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    let raf: number;
    const animate = () => {
      outline.current.x += (mouse.current.x - outline.current.x) * 0.15;
      outline.current.y += (mouse.current.y - outline.current.y) * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${outline.current.x - 16}px, ${outline.current.y - 16}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    const interactives = document.querySelectorAll("a, button, input, textarea, [role='button']");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[99999]" style={{ mixBlendMode: "difference" }}>
      <div
        ref={dotRef}
        className="w-2 h-2 rounded-full transition-transform duration-150"
        style={{
          background: "hsl(213, 94%, 68%)",
          transform: `translate(-10px, -10px)`,
          scale: hovering ? "1.5" : "1",
        }}
      />
      <div
        ref={outlineRef}
        className="w-8 h-8 rounded-full transition-all duration-200"
        style={{
          border: `2px solid hsla(213, 94%, 68%, ${hovering ? 0.8 : 0.5})`,
          transform: `translate(-10px, -10px)`,
          scale: hovering ? "1.8" : "1",
        }}
      />
    </div>
  );
};

export default CustomCursor;
