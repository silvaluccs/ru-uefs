import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto min-h-[300px] animate-fade-in">
      <div className="p-3 bg-gray-50 text-gray-400 rounded-full mb-4">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
    </div>
  );
}
