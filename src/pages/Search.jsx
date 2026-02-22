import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { searchVideos } from "../api/youtube"
import { addToSearchHistory } from "../utils/searchHistory"
import VideoCard from "../components/VideoCard"
import VideoCardSkeleton from "../components/VideoCardSkeleton"
import { AlertCircle, Search as SearchIcon } from "lucide-react"

function SearchHeading({ query }) {
  return (
    <header className="home-heading mb-3">
      <div className="home-heading-card flex items-center gap-2.5 min-h-0">
        <span className="home-heading-icon flex items-center justify-center w-6 h-6 rounded-md shrink-0">
          <SearchIcon className="w-3 h-3" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <h3 className="text-base font-semibold tracking-tight shrink-0">
              Search
            </h3>
            <span className="home-heading-desc text-[11px] sm:text-xs opacity-90 shrink-0">·</span>
            <span className="home-heading-desc text-[11px] sm:text-xs truncate max-w-[200px] sm:max-w-[280px]" title={query}>
              {query || "Enter a query"}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get("q") || ""

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!q.trim()) {
      setLoading(false)
      setVideos([])
      return
    }

    addToSearchHistory(q)

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const items = await searchVideos(q, { maxResults: 25 })
        if (!cancelled) setVideos(items)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [q])

  if (!q.trim()) {
    return (
      <div className="p-4">
        <SearchHeading query="" />
        <div className="watch-details-card rounded-lg p-4 sm:p-5">
          <p className="page-description text-sm">Enter a search term in the navbar.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <SearchHeading query={q} />
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
        <SearchHeading query={q} />
        <div className="watch-details-card rounded-lg p-4 sm:p-5 max-w-sm mx-auto">
          <div className="error-state flex flex-col items-center justify-center text-center">
            <div className="error-state-icon p-3 rounded-full mb-3">
              <AlertCircle className="w-10 h-10 text-[#ff4500]" />
            </div>
            <h2 className="text-base font-semibold page-title mb-1.5">Couldn't load results</h2>
            <p className="page-description text-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary px-4 py-2 text-sm rounded-md font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className="p-4">
        <SearchHeading query={q} />
        <div className="watch-details-card rounded-lg p-4 sm:p-5">
          <p className="page-description text-sm">No videos found for "{q}".</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <SearchHeading query={q} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {videos.map((video) => (
          <VideoCard key={video.id?.videoId || video.etag} video={video} />
        ))}
      </div>
    </div>
  )
}
