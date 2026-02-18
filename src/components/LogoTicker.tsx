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

const testimonialSnippets = [
  "Added $3,400/mo in 60 days",
  "Never missed a booking again",
  "Clients book at 2am while I sleep",
  "Deposits eliminated my no-shows",
  "Looked like a $5k website for $54/mo",
  "Set up in one afternoon",
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
  const snippetsDoubled = [...testimonialSnippets, ...testimonialSnippets, ...testimonialSnippets, ...testimonialSnippets];

  return (
    <section
      className="relative py-10 md:py-14 overflow-hidden"
      style={{ background: "hsl(210, 40%, 98%)" }}
    >
      <p
        className="text-center text-sm mb-8 font-medium"
        style={{ color: "hsl(215, 16%, 47%)" }}
      >
        Powering shops trusted by detailers, PPF installers, and tint pros across the country
      </p>

      {/* Logo row */}
      <div className="relative">
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

      {/* Testimonial snippets row — reverse direction */}
      <div className="relative mt-6">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(210, 40%, 98%), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(210, 40%, 98%), transparent)" }}
        />
        <div className="flex animate-logo-scroll-reverse" style={{ width: 'max-content' }}>
          {snippetsDoubled.map((snippet, i) => (
            <span
              key={`snippet-${i}`}
              className="mx-6 text-sm italic whitespace-nowrap select-none"
              style={{ color: "hsl(215, 16%, 55%)", minWidth: "max-content" }}
            >
              "{snippet}"
              {i < snippetsDoubled.length - 1 && (
                <span className="ml-6" style={{ color: "hsl(45, 80%, 55%)" }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
