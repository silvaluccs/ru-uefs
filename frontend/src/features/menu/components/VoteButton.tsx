import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface VoteButtonProps {
  type: "like" | "dislike";
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  size?: "lg" | "sm";
}

export function VoteButton({ type, active, disabled, onClick, size = "lg" }: VoteButtonProps) {
  const [bump, setBump] = useState(0);
  const Icon = type === "like" ? ThumbsUp : ThumbsDown;
  const isLike = type === "like";

  const handleClick = () => {
    if (disabled) return;
    setBump((b) => b + 1);
    onClick();
  };

  const dims = size === "lg" ? "w-14 h-14" : "w-7 h-7";
  const iconDims = size === "lg" ? "w-6 h-6" : "w-3.5 h-3.5";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-label={isLike ? "Curti" : "Não curti"}
      aria-pressed={active}
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-visible transition-colors duration-200 disabled:opacity-40",
        dims,
        active
          ? isLike
            ? "bg-emerald-500 text-white shadow-[0_0_0_1px_rgba(16,185,129,.4)]"
            : "bg-red-500 text-white shadow-[0_0_0_1px_rgba(239,68,68,.4)]"
          : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500",
      )}
    >
      <AnimatePresence>
        {bump > 0 && (
          <motion.span
            key={bump}
            initial={{ scale: 0.5, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full",
              isLike ? "bg-emerald-500" : "bg-red-500",
            )}
          />
        )}
      </AnimatePresence>
      <motion.span
        key={bump}
        initial={{ scale: 0.55, rotate: isLike ? -14 : 14 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 14 }}
        className="relative flex"
      >
        <Icon className={iconDims} fill={active ? "currentColor" : "none"} strokeWidth={2.2} />
      </motion.span>
    </button>
  );
}
