const ServiceCardSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-lg skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-36 rounded skeleton-shimmer" />
        <div className="h-3 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-2/3 rounded skeleton-shimmer" />
      </div>
      <div className="h-6 w-16 rounded skeleton-shimmer shrink-0" />
    </div>
  </div>
);

export const ServiceListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <ServiceCardSkeleton key={i} />
    ))}
  </div>
);

export default ServiceCardSkeleton;
