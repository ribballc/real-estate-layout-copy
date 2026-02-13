const CtaFooter = () => {
  return (
    <>
      {/* CTA */}
      <section className="bg-primary py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-8">
            Reach your best audience at the lowest cost!
          </h2>
          <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-10 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity">
            Create Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-10 px-6 border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-xl font-bold text-primary-foreground tracking-tight">realize:</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Opt Out</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;
