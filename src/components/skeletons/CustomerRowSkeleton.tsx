const CustomerRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl alytics-card animate-pulse">
    <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-32 rounded skeleton-shimmer" />
      <div className="h-3 w-48 rounded skeleton-shimmer" />
    </div>
    <div className="h-5 w-16 rounded-full skeleton-shimmer shrink-0" />
    <div className="w-8 h-8 rounded-lg skeleton-shimmer shrink-0" />
  </div>
);

export const CustomerListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <CustomerRowSkeleton key={i} />
    ))}
  </div>
);

export default CustomerRowSkeleton;
