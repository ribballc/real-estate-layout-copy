// Logo ticker: Deluxe, Access Luxury, R Exotics, ECM, Black Label (transparent SVGs) + 2 new SVGs
const logoBase = "/logos";
const deluxeDetailing = `${logoBase}/deluxe-detailing.png`;
const accessLuxury = `${logoBase}/access-luxury.png`;
// Use transparent SVGs for R Exotics, ECM, Black Label (PNGs have black backgrounds)
const rExotics = `${logoBase}/logo-1.svg`;
const ecmLa = `${logoBase}/logo-2.svg`;
const blackLabel = `${logoBase}/logo-3.svg`;
const logoNew1 = `${logoBase}/logo-new-1.svg`;
const logoNew2 = `${logoBase}/logo-new-2.svg`;

const logos = [
  { name: "Deluxe Detailing", src: deluxeDetailing },
  { name: "Access Luxury", src: accessLuxury },
  { name: "R Exotics", src: rExotics },
  { name: "ECM Los Angeles", src: ecmLa },
  { name: "Black Label Exotics", src: blackLabel },
  { name: "Partner", src: logoNew1 },
  { name: "Partner", src: logoNew2 },
];

const LogoItem = ({ name, src }: { name: string; src: string }) => (
  <div className="flex flex-shrink-0 items-center justify-center mx-4 select-none bg-transparent" style={{ minWidth: "max-content" }}>
    <img
      src={src}
      alt={name}
      width={98}
      height={56}
      className="h-14 md:h-16 w-auto object-contain bg-transparent flex-shrink-0"
      draggable={false}
    />
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
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(210, 40%, 98%), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(210, 40%, 98%), transparent)" }}
        />

        <div
          className="flex animate-logo-scroll will-change-transform"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          {doubled.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} {...logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
