import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}
