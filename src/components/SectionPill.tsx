import { type ReactNode } from "react";

interface SectionPillProps {
  icon: ReactNode;
  label: string;
  highlight?: string;
}

const SectionPill = ({ icon, label, highlight }: SectionPillProps) => (
  <div className="flex justify-center mb-5">
    <span
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide"
      style={{
        background: "hsl(0, 0%, 100%)",
        border: "1px solid hsl(214, 20%, 90%)",
        boxShadow: "0 2px 12px hsla(217, 91%, 60%, 0.08), 0 0 0 1px hsla(217, 91%, 60%, 0.04)",
        color: "hsl(215, 25%, 27%)",
        animation: "pillFadeIn 0.6s ease-out both",
      }}
    >
      <span
        className="flex items-center justify-center w-5 h-5"
        style={{ color: "hsl(217, 91%, 55%)", animation: "pillIconSpin 0.8s ease-out 0.3s both" }}
      >
        {icon}
      </span>
      {label}
      {highlight && (
        <span
          className="text-[11px] font-bold px-1.5 py-0.5 rounded"
          style={{
            background: "hsl(217, 91%, 55%)",
            color: "hsl(0, 0%, 100%)",
          }}
        >
          {highlight}
        </span>
      )}
    </span>
  </div>
);

export default SectionPill;
