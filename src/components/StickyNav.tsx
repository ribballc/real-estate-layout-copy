import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import darkerLogo from "@/assets/darker-logo.png";

const StickyNav = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 transition-all duration-300"
      style={{
        height: 52,
        background: "hsla(215, 50%, 10%, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid hsla(0, 0%, 100%, 0.08)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <img src={darkerLogo} alt="Darker" className="h-7" width={65} height={28} />
      <Link
        to="/signup"
        className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Start Free →
      </Link>
    </nav>
  );
};

export default StickyNav;
