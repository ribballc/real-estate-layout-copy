import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Decorative curved bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-background" style={{ borderTopLeftRadius: "50% 100%", borderTopRightRadius: "50% 100%" }} />
      
      <div className="relative z-10 px-6 pt-8 pb-48">
        {/* Logo */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-foreground tracking-tight">realize:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mt-16 md:mt-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Performance Solutions to Promote Your{" "}
            <span className="bg-accent text-accent-foreground px-4 py-1 inline-block mt-2">
              Business Listing
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Get your business listing in front of the right audience with targeted, outcome-based advertising
          </p>
          <button className="mt-10 inline-flex items-center gap-2 bg-transparent border-2 border-primary-foreground text-primary-foreground px-8 py-3 rounded-full text-lg font-medium hover:bg-primary-foreground hover:text-primary transition-colors duration-300">
            Create Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
