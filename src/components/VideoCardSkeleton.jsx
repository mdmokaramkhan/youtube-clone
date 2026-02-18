export default function VideoCardSkeleton() {
  return (
    <div className="video-card-skeleton rounded-xl overflow-hidden">
      <div className="skeleton-shimmer skeleton-block relative aspect-video w-full rounded-t-xl" />
      <div className="px-3 py-3 flex gap-3">
        <div className="skeleton-shimmer skeleton-block w-9 h-9 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton-shimmer skeleton-block h-4 rounded w-full" />
          <div className="skeleton-shimmer skeleton-block h-3 rounded w-3/4" />
          <div className="skeleton-shimmer skeleton-block h-3 rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}
