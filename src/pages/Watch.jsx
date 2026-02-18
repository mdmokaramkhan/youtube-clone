import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { User, AlertCircle } from "lucide-react"
import {
  fetchVideoDetails,
  fetchChannelVideos,
  fetchVideos,
  fetchVideoComments,
} from "../api/youtube"
import WatchRecommendedCard from "../components/WatchRecommendedCard"

/**
 * Format view count (e.g. 1234567 → "1.2M views")
 */
function formatViews(countStr) {
  const count = parseInt(countStr, 10)
  if (isNaN(count)) return ""
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B views`
  }
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K views`
  }
  return `${count} views`
}

/**
 * Format ISO date to relative time (e.g. "2 days ago")
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

/**
 * Format publish date (e.g. "Feb 18, 2025")
 */
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const DESCRIPTION_PREVIEW_LENGTH = 120

function DescriptionBlock({ text }) {
  const [expanded, setExpanded] = useState(false)
  const trimmed = text?.trim() || ""
  const needsToggle = trimmed.length > DESCRIPTION_PREVIEW_LENGTH
  const displayText = expanded || !needsToggle
    ? trimmed
    : `${trimmed.slice(0, DESCRIPTION_PREVIEW_LENGTH).trim()}…`

  if (!trimmed) return null

  return (
    <>
      <p className="text-[13px] page-description whitespace-pre-wrap leading-relaxed">
        {displayText}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="watch-show-more-pill mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  )
}

function CommentItem({ thread }) {
  const comment = thread?.snippet?.topLevelComment?.snippet
  if (!comment) return null
  const avatar =
    comment.authorProfileImageUrl ||
    "https://www.gravatar.com/avatar/?d=mp&s=40"

  return (
    <div className="watch-comment-item flex gap-3 py-3">
      <img
        src={avatar}
        alt=""
        className="w-8 h-8 rounded-full shrink-0 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-medium page-title">
            {comment.authorDisplayName}
          </span>
          <span className="text-xs page-description">
            {timeAgo(comment.publishedAt)}
          </span>
        </div>
        <p className="text-[13px] page-description mt-0.5 leading-relaxed whitespace-pre-wrap">
          {comment.textOriginal || comment.textDisplay}
        </p>
      </div>
    </div>
  )
}

export default function Watch() {
  const [searchParams] = useSearchParams()
  const videoId = searchParams.get("v")

  const [videoDetails, setVideoDetails] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!videoId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const details = await fetchVideoDetails(videoId)
        if (cancelled) return
        setVideoDetails(details)

        const channelId = details?.snippet?.channelId
        const [related, commentsData] = await Promise.all([
          channelId
            ? fetchChannelVideos(channelId, {
                maxResults: 20,
                excludeVideoId: videoId,
              })
            : fetchVideos({ maxResults: 20 }),
          fetchVideoComments(videoId, { maxResults: 20 }).catch(() => []),
        ])
        if (!cancelled) {
          setRelatedVideos(related)
          setComments(Array.isArray(commentsData) ? commentsData : [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [videoId])

  if (!videoId) {
    return (
      <div className="p-4">
        <h1 className="text-base font-semibold page-title mb-1.5">Watch</h1>
        <p className="page-description text-sm">
          Select a video from the home page to watch.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="aspect-video w-full max-w-5xl rounded-xl overflow-hidden bg-[#272729] animate-pulse" />
        <div className="mt-4 h-6 w-3/4 rounded bg-[#272729] animate-pulse" />
        <div className="mt-2 h-4 w-1/2 rounded bg-[#272729] animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="error-state flex flex-col items-center justify-center min-h-[36vh] text-center max-w-sm mx-auto">
          <div className="error-state-icon p-3 rounded-full mb-3">
            <AlertCircle className="w-10 h-10 text-[#ff4500]" />
          </div>
          <h2 className="text-base font-semibold page-title mb-1.5">
            Couldn't load video
          </h2>
          <p className="page-description text-sm mb-5">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2 text-sm rounded-md font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const snippet = videoDetails?.snippet
  const statistics = videoDetails?.statistics

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      {/* Left: Video + Details */}
      <div className="flex-1 min-w-0">
        {/* Video player */}
        <div className="aspect-video w-full max-w-5xl rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
            title={snippet?.title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Card 1: Video info (title, engagement, channel) – no section titles */}
        <div className="mt-3 max-w-5xl">
          <div className="watch-details-card rounded-lg p-3 sm:p-4">
            {/* Title + engagement stats */}
            <div className="flex flex-col gap-1 sm:gap-0 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="watch-details-title text-sm sm:text-base font-semibold page-title leading-snug pr-4">
                {snippet?.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs page-description shrink-0">
                {statistics?.viewCount && (
                  <span>{formatViews(statistics.viewCount)}</span>
                )}
                {snippet?.publishedAt && (
                  <>
                    {statistics?.viewCount && (
                      <span className="watch-details-sep">·</span>
                    )}
                    <span>{formatDate(snippet.publishedAt)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Channel */}
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="video-card-avatar flex shrink-0 w-8 h-8 rounded-full items-center justify-center">
                <User className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium page-title">
                {snippet?.channelTitle}
              </span>
            </div>
          </div>

          {/* Card 2: Description with title and show more pill */}
          {snippet?.description && (
            <div className="watch-details-card mt-2 rounded-lg p-3 sm:p-4">
              <h3 className="text-xs font-semibold page-title mb-2 uppercase tracking-wide">
                Description
              </h3>
              <DescriptionBlock text={snippet.description} />
            </div>
          )}

          {/* Card 3: Comments (read-only) */}
          <div className="watch-details-card mt-2 rounded-lg p-3 sm:p-4">
            <h3 className="text-xs font-semibold page-title mb-3 uppercase tracking-wide">
              Comments
            </h3>
            {comments.length === 0 ? (
              <p className="text-sm page-description py-2">
                No comments yet.
              </p>
            ) : (
              <div className="divide-y divide-[#272729]/80 [data-theme='light']:divide-[#e5e5e5]/80">
                {comments.map((thread) => (
                  <CommentItem
                    key={thread.id || thread.etag}
                    thread={thread}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Recommended videos */}
      <aside className="lg:w-[400px] lg:shrink-0">
        <h2 className="text-sm font-semibold page-title mb-3 px-1">
          Recommended
        </h2>
        <div className="flex flex-col gap-1">
          {relatedVideos.map((video) => (
            <WatchRecommendedCard
              key={video.id?.videoId || video.etag}
              video={video}
              isActive={video.id?.videoId === videoId}
            />
          ))}
        </div>
      </aside>
    </div>
  )
}
