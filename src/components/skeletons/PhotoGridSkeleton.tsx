const PhotoGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="animate-pulse">
    <div className="h-7 w-32 rounded skeleton-shimmer mb-6" />
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl skeleton-shimmer" />
      ))}
    </div>
  </div>
);

export default PhotoGridSkeleton;
