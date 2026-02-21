import ecmLa from "@/assets/logos/ecm-la.png";
import accessLuxury from "@/assets/logos/access-luxury.png";
import deluxeDetailing from "@/assets/logos/deluxe-detailing.png";
import rExotics from "@/assets/logos/r-exotics.png";
import blackLabel from "@/assets/logos/black-label.png";

const logos = [
  { name: "ECM Los Angeles", src: ecmLa },
  { name: "Access Luxury", src: accessLuxury },
  { name: "Deluxe Detailing", src: deluxeDetailing },
  { name: "R Exotics", src: rExotics },
  { name: "Black Label Exotics", src: blackLabel },
];

const LogoItem = ({ name, src }: { name: string; src: string }) => (
  <div className="flex items-center justify-center mx-10 select-none" style={{ minWidth: "max-content" }}>
    <img
      src={src}
      alt={name}
      width={98}
      height={56}
      className="h-14 md:h-16 w-auto object-contain opacity-50 grayscale"
      draggable={false}
      loading="lazy"
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
