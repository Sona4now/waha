import Skeleton, { SkeletonCard } from "@/components/site/Skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      <div className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-center">
        <Skeleton className="h-10 w-40 mx-auto !bg-white/15 rounded-lg" />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
