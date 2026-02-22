const DeluxeLandingSkeleton = () => (
  <main className="min-h-screen bg-surface-0">
    <div className="h-16 w-full" />
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-surface-2 rounded-full mx-auto" />
        <div className="h-16 w-3/4 bg-surface-2 rounded-lg mx-auto" />
        <div className="h-16 w-1/2 bg-surface-2 rounded-lg mx-auto" />
        <div className="h-6 w-full max-w-md bg-surface-2 rounded mx-auto" />
        <div className="flex gap-4 justify-center pt-4">
          <div className="h-12 w-40 bg-surface-2 rounded-full" />
          <div className="h-12 w-36 bg-surface-2 rounded-full" />
        </div>
      </div>
    </section>
  </main>
);

export default DeluxeLandingSkeleton;
