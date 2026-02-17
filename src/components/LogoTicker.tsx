const logos = [
  { name: "DetailPro", text: "DETAILPRO" },
  { name: "ShineWorks", text: "ShineWorks" },
  { name: "AutoGloss", text: "AUTOGLOSS" },
  { name: "CeramicKing", text: "CeramicKing" },
  { name: "PristineCar", text: "PRISTINE" },
  { name: "EliteFinish", text: "EliteFinish" },
  { name: "MirrorShield", text: "MirrorShield" },
  { name: "LuxeDetail", text: "LUXEDETAIL" },
];

const LogoItem = ({ name, text }: { name: string; text: string }) => (
  <div className="flex items-center gap-2 mx-10 select-none opacity-40 grayscale" style={{ minWidth: "max-content" }}>
    <span
      className="text-xl md:text-2xl tracking-wide"
      style={{
        fontFamily:
          name === "DetailPro" || name === "AutoGloss" || name === "PristineCar" || name === "LuxeDetail"
            ? "'Inter', sans-serif"
            : "'Georgia', serif",
        fontWeight: name === "DetailPro" || name === "AutoGloss" ? 800 : 600,
        fontStyle: name === "EliteFinish" || name === "MirrorShield" ? "italic" : "normal",
        color: "hsl(215, 16%, 47%)",
        letterSpacing: name === "AutoGloss" || name === "PristineCar" ? "0.15em" : "0.02em",
      }}
    >
      {text}
    </span>
  </div>
);

const LogoTicker = () => {
  const doubled = [...logos, ...logos];

  return (
    <section
      className="relative py-10 md:py-14 overflow-hidden"
      style={{ background: "hsl(210, 40%, 98%)" }}
    >
      <p
        className="text-center text-sm md:text-[15px] mb-8 font-medium"
        style={{ color: "hsl(215, 16%, 47%)" }}
      >
        Trusted by 200+ auto detailing shops across the country
      </p>

      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(210, 40%, 98%), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(210, 40%, 98%), transparent)" }}
        />

        <div className="flex animate-logo-scroll">
          {doubled.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} {...logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
