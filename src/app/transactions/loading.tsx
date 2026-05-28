import { SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
          <div>
            <SkeletonLine width="w-36" />
            <div className="h-3 w-52 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton mt-1" />
          </div>
        </div>
        <div className="h-9 w-24 rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
          ))}
        </div>
      </div>
      <div className="hidden sm:block bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800">
        <div className="p-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-stone-100 dark:border-stone-800 last:border-0">
              <div className="h-4 w-8 bg-stone-200 dark:bg-stone-700 animate-skeleton rounded" />
              <div className="h-4 w-24 bg-stone-200 dark:bg-stone-700 animate-skeleton rounded" />
              <div className="h-4 w-16 bg-stone-200 dark:bg-stone-700 animate-skeleton rounded" />
              <div className="h-4 w-32 bg-stone-200 dark:bg-stone-700 animate-skeleton rounded" />
              <div className="h-4 flex-1 bg-stone-200 dark:bg-stone-700 animate-skeleton rounded" />
              <div className="h-4 w-20 bg-stone-200 dark:bg-stone-700 animate-skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
