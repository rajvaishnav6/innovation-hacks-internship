import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-rose-100 bg-rose-50 px-6 py-14 text-center">
      <AlertTriangle className="mb-3 h-10 w-10 text-rose-400" />
      <p className="font-medium text-rose-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
