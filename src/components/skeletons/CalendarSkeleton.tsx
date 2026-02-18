const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarSkeleton = () => (
  <div className="animate-pulse">
    {/* Month header */}
    <div className="flex items-center justify-between mb-4">
      <div className="h-7 w-40 rounded skeleton-shimmer" />
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
        <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
      </div>
    </div>

    {/* Day headers */}
    <div className="grid grid-cols-7 gap-1 mb-1">
      {DAY_HEADERS.map((d) => (
        <div key={d} className="text-center text-xs font-medium py-1 dash-card-label">{d}</div>
      ))}
    </div>

    {/* Calendar cells — 5 rows */}
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg p-1.5 flex flex-col items-center gap-1"
          style={{ background: "hsla(0,0%,100%,0.03)" }}
        >
          <div className="h-3 w-4 rounded skeleton-shimmer" />
          <div className="flex gap-0.5 mt-auto">
            {i % 3 === 0 && <div className="w-1.5 h-1.5 rounded-full skeleton-shimmer" />}
            {i % 5 === 0 && <div className="w-1.5 h-1.5 rounded-full skeleton-shimmer" />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CalendarSkeleton;
