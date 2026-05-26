import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.3)] transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}
