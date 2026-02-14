const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsla(217, 91%, 60%, 1), transparent 70%)",
        opacity: 0.03,
        top: "10%",
        left: "-10%",
        filter: "blur(120px)",
        animation: "orbFloat1 60s ease-in-out infinite",
      }}
    />
    <div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsla(213, 94%, 68%, 1), transparent 70%)",
        opacity: 0.025,
        bottom: "20%",
        right: "-5%",
        filter: "blur(100px)",
        animation: "orbFloat2 50s ease-in-out infinite",
      }}
    />
  </div>
);

export default FloatingOrbs;
