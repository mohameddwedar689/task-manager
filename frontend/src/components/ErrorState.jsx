export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-100 bg-red-50 py-12 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium text-brand-600 underline hover:text-brand-700">
          Try again
        </button>
      )}
    </div>
  );
}
