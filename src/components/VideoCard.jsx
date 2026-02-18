import { Link } from "react-router-dom"
import { Play, User } from "lucide-react"

/**
 * Format ISO date to relative time (e.g., "2 days ago")
 */
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

function ChannelAvatar() {
  return (
    <div
      className="video-card-avatar flex shrink-0 w-9 h-9 rounded-full items-center justify-center"
      aria-hidden
    >
      <User className="w-4 h-4 text-white" strokeWidth={2} />
    </div>
  )
}

export default function VideoCard({ video }) {
  const videoId = video?.id?.videoId
  const snippet = video?.snippet

  if (!videoId || !snippet) return null

  const thumbnails = snippet.thumbnails
  const thumbnail =
    thumbnails?.maxres || thumbnails?.high || thumbnails?.medium || thumbnails?.default
  const thumbnailUrl = thumbnail?.url

  return (
    <Link
      to={`/watch?v=${videoId}`}
      className="video-card group block rounded-xl overflow-hidden transition-all duration-250"
    >
      {/* Thumbnail */}
      <div className="video-card-thumb-wrap relative aspect-video w-full overflow-hidden rounded-t-xl">
        <img
          src={thumbnailUrl}
          alt={snippet.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="video-card-thumb-overlay absolute inset-0 transition-opacity duration-250" />
        <div className="video-card-play-overlay absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
          <span className="video-card-play-btn flex items-center justify-center w-12 h-12 rounded-full">
            <Play className="w-5 h-5 ml-0.5 text-[#0c0c0d] fill-current" strokeWidth={2.5} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-3 flex gap-3">
        <ChannelAvatar />
        <div className="min-w-0 flex-1">
          <h3
            className="video-card-title font-medium text-[14px] leading-snug line-clamp-2 transition-colors"
            title={snippet.title}
          >
            {snippet.title}
          </h3>
          <div className="video-card-meta mt-1 flex items-center gap-1.5 text-[13px] truncate">
            <span>{snippet.channelTitle}</span>
            <span className="video-card-meta-secondary">·</span>
            <span className="video-card-meta-secondary">{timeAgo(snippet.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
