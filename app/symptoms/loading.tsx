import Skeleton from "@/components/site/Skeleton";

export default function SymptomsLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      <div className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-center">
        <Skeleton className="h-10 w-56 mx-auto !bg-white/15 rounded-lg" />
      </div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
