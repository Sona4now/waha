import Skeleton, { SkeletonCard } from "@/components/site/Skeleton";

export default function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      {/* Hero */}
      <div className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-center">
        <div className="max-w-[1280px] mx-auto px-6 space-y-4">
          <Skeleton className="h-10 w-64 mx-auto !bg-white/15 rounded-lg" />
          <Skeleton className="h-4 w-80 mx-auto !bg-white/10 rounded" />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
