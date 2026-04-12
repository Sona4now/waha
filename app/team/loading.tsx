import Skeleton from "@/components/site/Skeleton";

export default function TeamLoading() {
  return (
    <div className="min-h-screen bg-[#070d15]">
      {/* Hero */}
      <div className="pt-20 pb-8 px-6 text-center space-y-4">
        <Skeleton className="h-4 w-24 mx-auto !bg-white/10 rounded" />
        <Skeleton className="h-14 w-56 mx-auto !bg-white/10 rounded-lg" />
        <Skeleton className="h-4 w-72 mx-auto !bg-white/10 rounded" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-4 max-w-[1400px] mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full !bg-white/10" />
        ))}
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="w-20 h-20 rounded-full !bg-white/10" />
              <Skeleton className="h-3 w-24 !bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
