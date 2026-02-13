const publishers = ["Yahoo!", "USA Today", "Business Insider", "The Weather Channel", "CBS News"];

const PublishersSection = () => {
  return (
    <section className="bg-background py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-10">
          Run Ads on Premium Publisher Sites
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {publishers.map((name) => (
            <div key={name} className="text-muted-foreground font-bold text-lg md:text-xl opacity-60 hover:opacity-100 transition-opacity">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
