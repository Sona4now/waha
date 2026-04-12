import Skeleton from "@/components/site/Skeleton";

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      <div className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-center">
        <Skeleton className="h-10 w-48 mx-auto !bg-white/15 rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex gap-3 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  );
}
