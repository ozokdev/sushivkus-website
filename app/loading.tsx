export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* TopBar skeleton */}
      <div className="h-10 bg-accent/5 animate-pulse" />

      {/* Header skeleton */}
      <div className="h-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="w-32 h-8 bg-white/[0.06] rounded-lg animate-pulse" />
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-white/[0.06] rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-white/[0.06] rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="h-[400px] bg-white/[0.02] animate-pulse" />

      {/* Category Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-48 h-8 bg-white/[0.06] rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/2] bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>

      {/* Menu skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-40 h-8 bg-white/[0.06] rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-white/[0.06]" />
              <div className="p-3 md:p-4 space-y-2">
                <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded w-full" />
                <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-5 bg-white/[0.06] rounded w-16" />
                  <div className="h-8 bg-white/[0.06] rounded-xl w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
