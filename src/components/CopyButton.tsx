import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { TOAST } from "@/lib/toast-messages";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: "default" | "ghost" | "inline";
  toastMessage?: { title: string; description?: string };
}

const CopyButton = ({
  text,
  label = "Copy Link",
  copiedLabel = "Copied!",
  className = "",
  variant = "default",
  toastMessage,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast(toastMessage || TOAST.LINK_COPIED);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(TOAST.GENERIC_ERROR);
    }
  }, [text, toast, toastMessage]);

  const baseClasses =
    variant === "default"
      ? "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
      : variant === "ghost"
        ? "inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
        : "inline-flex items-center gap-1 text-xs font-semibold transition-all duration-150";

  const bgClasses =
    variant === "default"
      ? copied
        ? "bg-[hsl(160,84%,39%)] text-white shadow-lg shadow-[hsla(160,84%,39%,0.3)]"
        : "text-white hover:brightness-110"
      : copied
        ? "text-[hsl(160,84%,39%)]"
        : "text-[hsl(217,91%,60%)] hover:text-[hsl(217,91%,65%)]";

  return (
    <motion.button
      onClick={handleCopy}
      className={`${baseClasses} ${bgClasses} ${className}`}
      style={
        variant === "default" && !copied
          ? {
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
              boxShadow: "0 2px 12px hsla(217,91%,60%,0.25)",
            }
          : undefined
      }
      whileTap={{ scale: 0.96 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {copiedLabel}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;
