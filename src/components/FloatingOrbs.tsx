const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <div
      className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04]"
      style={{
        background: "radial-gradient(circle, hsl(82 75% 55%), transparent 70%)",
        top: "10%",
        left: "-10%",
        filter: "blur(120px)",
        animation: "orbFloat1 50s ease-in-out infinite",
      }}
    />
    <div
      className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03]"
      style={{
        background: "radial-gradient(circle, hsl(172 55% 40%), transparent 70%)",
        bottom: "20%",
        right: "-5%",
        filter: "blur(100px)",
        animation: "orbFloat2 40s ease-in-out infinite",
      }}
    />
  </div>
);

export default FloatingOrbs;
