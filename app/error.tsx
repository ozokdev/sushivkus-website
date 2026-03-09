"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Что-то пошло не так</h2>
        <p className="text-gray-400">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
