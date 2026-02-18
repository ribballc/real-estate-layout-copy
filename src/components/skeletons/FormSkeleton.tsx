/** Generic form skeleton for business info, social media, hours, etc. */
const FormSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="max-w-2xl animate-pulse space-y-5">
    <div className="h-7 w-48 rounded skeleton-shimmer mb-6" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 w-24 rounded skeleton-shimmer" />
        <div className="h-10 w-full rounded-lg skeleton-shimmer" />
      </div>
    ))}
    <div className="h-11 w-32 rounded-lg skeleton-shimmer mt-6" />
  </div>
);

export default FormSkeleton;
