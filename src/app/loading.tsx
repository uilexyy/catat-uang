import { SkeletonCard, SkeletonChart } from "@/components/Skeleton";
import { SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
        <div>
          <SkeletonLine width="w-32" />
          <div className="h-3 w-48 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonChart />
    </div>
  );
}
