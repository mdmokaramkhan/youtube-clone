import { Link } from "react-router-dom"
import { Play } from "lucide-react"

function timeAgo(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ]

  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s)
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? "s" : ""} ago`
    }
  }
  return "just now"
}

export default function WatchRecommendedCard({ video, isActive }) {
  const videoId = video?.id?.videoId
  const snippet = video?.snippet

  if (!videoId || !snippet) return null

  const thumbnails = snippet.thumbnails
  const thumbnail =
    thumbnails?.medium || thumbnails?.high || thumbnails?.default
  const thumbnailUrl = thumbnail?.url

  return (
    <Link
      to={`/watch?v=${videoId}`}
      className={`watch-recommended-card group flex gap-3 p-1 -mx-1 rounded-lg transition-colors duration-200 ${
        isActive ? "watch-recommended-card-active" : ""
      }`}
    >
      <div className="watch-recommended-thumb relative shrink-0 w-[168px] min-w-[168px] aspect-video rounded-lg overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={snippet.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="watch-recommended-play absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
          <span className="watch-recommended-play-btn flex items-center justify-center w-9 h-9 rounded-full">
            <Play className="w-4 h-4 ml-0.5 text-[#0c0c0d] fill-current" strokeWidth={2.5} />
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h3
          className="watch-recommended-title font-medium text-[13px] leading-snug line-clamp-2 transition-colors"
          title={snippet.title}
        >
          {snippet.title}
        </h3>
        <p className="watch-recommended-channel text-[12px] mt-0.5 truncate">
          {snippet.channelTitle}
        </p>
        <p className="watch-recommended-meta text-[12px] text-[#6b6d70] mt-0.5">
          {timeAgo(snippet.publishedAt)}
        </p>
      </div>
    </Link>
  )
}
