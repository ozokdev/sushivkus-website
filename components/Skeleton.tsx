"use client";

export function ProductSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
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
  );
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
