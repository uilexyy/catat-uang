export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton" />
        <div className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-700 animate-skeleton" />
      </div>
      <div className="h-7 w-32 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="animate-stagger-fade" style={{ animationDelay: "0s" }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton ${i === 1 ? "w-8 mx-auto" : i === 5 ? "w-48" : i === 6 ? "w-20 ml-auto" : "w-24"}`} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton" />
        <div className="h-3 w-40 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton" />
      </div>
      <div className="flex items-end gap-3 h-[300px]">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-stone-200 dark:bg-stone-700 animate-skeleton"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return <div className={`h-4 rounded bg-stone-200 dark:bg-stone-700 animate-skeleton ${width}`} />;
}
