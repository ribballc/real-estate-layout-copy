import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "compact";
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
}: EmptyStateProps) => {
  const isCompact = variant === "compact";

  return (
    <div className={`flex flex-col items-center text-center ${isCompact ? "py-8" : "py-14"}`}>
      {/* Icon with gradient circle */}
      <div
        className={`flex items-center justify-center rounded-full mb-4 ${isCompact ? "w-12 h-12" : "w-16 h-16"}`}
        style={{
          background: "linear-gradient(135deg, hsla(217,91%,60%,0.12) 0%, hsla(230,80%,55%,0.08) 100%)",
          border: "1px solid hsla(217,91%,60%,0.15)",
        }}
      >
        <Icon
          className={isCompact ? "w-5 h-5" : "w-7 h-7"}
          style={{ color: "hsl(217,91%,60%)" }}
          strokeWidth={1.5}
        />
      </div>

      {/* Text */}
      <div className="max-w-[360px]">
        <h3
          className={`font-bold tracking-tight dash-card-value ${isCompact ? "text-base" : "text-lg"}`}
        >
          {title}
        </h3>
        <p
          className={`mt-1.5 leading-relaxed text-muted-foreground ${isCompact ? "text-xs" : "text-sm"}`}
        >
          {description}
        </p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-5">
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
                boxShadow: "0 2px 12px hsla(217,91%,60%,0.25)",
              }}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: "hsl(217,91%,60%)",
                background: "hsla(217,91%,60%,0.08)",
                border: "1px solid hsla(217,91%,60%,0.15)",
              }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
