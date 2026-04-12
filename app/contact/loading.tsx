import Skeleton from "@/components/site/Skeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      <div className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-center">
        <Skeleton className="h-10 w-32 mx-auto !bg-white/15 rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
