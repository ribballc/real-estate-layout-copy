import { MetricCardsSkeleton } from "./MetricCardSkeleton";

const DashboardPageSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {/* Metric cards */}
    <MetricCardsSkeleton />

    {/* Chart area */}
    <div className="rounded-2xl alytics-card p-5">
      <div className="h-5 w-32 rounded skeleton-shimmer mb-4" />
      <div className="h-[200px] rounded-lg skeleton-shimmer" />
    </div>

    {/* Table rows */}
    <div className="rounded-2xl alytics-card p-5 space-y-3">
      <div className="h-5 w-40 rounded skeleton-shimmer mb-2" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 w-8 rounded skeleton-shimmer" />
          <div className="h-4 flex-1 rounded skeleton-shimmer" />
          <div className="h-4 w-16 rounded skeleton-shimmer" />
          <div className="h-4 w-16 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export default DashboardPageSkeleton;
