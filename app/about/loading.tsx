import Skeleton from "@/components/site/Skeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] dark:bg-[#0a151f]">
      <div className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-center">
        <Skeleton className="h-10 w-32 mx-auto !bg-white/15 rounded-lg" />
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
