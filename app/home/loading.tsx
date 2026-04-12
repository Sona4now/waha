import Skeleton, { SkeletonCard } from "@/components/site/Skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      {/* Hero skeleton */}
      <div className="relative w-full h-[85vh] min-h-[500px] bg-[#12394d] overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto space-y-5 text-center">
            <Skeleton className="h-5 w-32 rounded-full mx-auto !bg-white/10" />
            <Skeleton className="h-14 w-3/4 mx-auto !bg-white/10" />
            <Skeleton className="h-5 w-2/3 mx-auto !bg-white/10" />
            <div className="flex gap-4 justify-center pt-4">
              <Skeleton className="h-12 w-40 rounded-full !bg-white/10" />
              <Skeleton className="h-12 w-40 rounded-full !bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Destinations skeleton */}
      <div className="max-w-[1280px] mx-auto px-6 pb-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
