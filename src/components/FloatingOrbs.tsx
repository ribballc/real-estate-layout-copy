const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsla(82, 65%, 55%, 1), transparent 70%)",
        opacity: 0.04,
        top: "10%",
        left: "-10%",
        filter: "blur(120px)",
        animation: "orbFloat1 60s ease-in-out infinite",
      }}
    />
    <div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsla(160, 50%, 30%, 1), transparent 70%)",
        opacity: 0.03,
        bottom: "20%",
        right: "-5%",
        filter: "blur(100px)",
        animation: "orbFloat2 50s ease-in-out infinite",
      }}
    />
    <div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: "radial-gradient(circle, hsla(82, 65%, 55%, 1), transparent 70%)",
        opacity: 0.025,
        top: "60%",
        left: "40%",
        filter: "blur(100px)",
        animation: "orbFloat1 70s ease-in-out infinite reverse",
      }}
    />
  </div>
);

export default FloatingOrbs;
