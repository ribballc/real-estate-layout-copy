/** Skeleton for table-style views like estimates, jobs list, etc. */
const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="animate-pulse space-y-3">
    <div className="flex items-center justify-between mb-4">
      <div className="h-7 w-40 rounded skeleton-shimmer" />
      <div className="h-9 w-28 rounded-lg skeleton-shimmer" />
    </div>
    {/* Header */}
    <div className="flex gap-4 px-4 py-2">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-3 rounded skeleton-shimmer" style={{ flex: i === 1 ? 2 : 1 }} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: "hsla(0,0%,100%,0.03)" }}>
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="h-4 rounded skeleton-shimmer" style={{ flex: j === 1 ? 2 : 1 }} />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
