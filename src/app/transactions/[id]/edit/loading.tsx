import { SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
        <div>
          <SkeletonLine width="w-36" />
          <div className="h-3 w-44 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton mt-1" />
        </div>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="h-3 w-20 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton mb-2" />
            <div className="h-11 w-full rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
