import { useState, useEffect } from "react"
import { fetchVideos } from "../api/youtube"
import VideoCard from "../components/VideoCard"
import VideoCardSkeleton from "../components/VideoCardSkeleton"
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react"

function HomeHeading() {
  return (
    <header className="home-heading mb-3">
      <div className="home-heading-card flex items-center justify-between gap-3 min-h-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="home-heading-icon flex items-center justify-center w-6 h-6 rounded-md shrink-0">
            <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <h3 className=" text-base font-semibold tracking-tight shrink-0">
                Trending now
              </h3>
              <span className="home-heading-desc text-[11px] sm:text-xs opacity-90 shrink-0">·</span>
              <span className="home-heading-desc text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-[220px]">
                Fresh videos, updated live
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="home-heading-button home-heading-button-icon shrink-0 flex items-center justify-center w-8 h-8 p-0"
          aria-label="Refresh feed"
        >
          <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </header>
  )
}

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const items = await fetchVideos({ maxResults: 25 })
        if (!cancelled) {
          setVideos(items)
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
  }, [])

  if (loading) {
    return (
      <div className="p-4">
        <HomeHeading />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
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
          <h2 className="text-base font-semibold page-title mb-1.5">Couldn't load videos</h2>
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

  if (!videos.length) {
    return (
      <div className="p-4">
        <HomeHeading />
        <p className="page-description text-sm">No videos found.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <HomeHeading />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {videos.map((video) => (
          <VideoCard key={video.id?.videoId || video.etag} video={video} />
        ))}
      </div>
    </div>
  )
}
