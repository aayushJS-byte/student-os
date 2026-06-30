import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5">
      <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}
