const DeluxeLandingSkeleton = () => (
  <main className="min-h-screen bg-background font-montserrat">
    {/* Nav placeholder */}
    <div className="h-20 w-full" />

    {/* Hero skeleton */}
    <section className="min-h-screen flex items-center px-4">
      <div className="max-w-3xl w-full space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-16 w-3/4 bg-muted rounded" />
        <div className="h-16 w-1/2 bg-muted rounded" />
        <div className="h-6 w-full max-w-xl bg-muted rounded" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-32 bg-muted rounded-lg" />
          <div className="h-12 w-28 bg-muted rounded-lg" />
        </div>
      </div>
    </section>

    {/* Section skeletons */}
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-10 w-48 bg-muted rounded mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-10 w-56 bg-muted rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </section>

    {/* Footer placeholder */}
    <div className="h-32 bg-muted/50" />
  </main>
);

export default DeluxeLandingSkeleton;
