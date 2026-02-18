const MetricCardSkeleton = () => (
  <div className="rounded-2xl p-5 alytics-card animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
      <div className="h-[32px] w-[80px] rounded skeleton-shimmer" />
    </div>
    <div className="h-3 w-20 rounded skeleton-shimmer mb-2" />
    <div className="h-9 w-28 rounded skeleton-shimmer mb-2" />
    <div className="h-3 w-24 rounded skeleton-shimmer" />
  </div>
);

export const MetricCardsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <MetricCardSkeleton key={i} />
    ))}
  </div>
);

export default MetricCardSkeleton;
