import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto min-h-75 animate-fade-in">
      <div className="p-3 bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 rounded-full mb-4 border border-transparent dark:border-zinc-800">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-zinc-100 text-lg mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
        {message}
      </p>
    </div>
  );
}
