import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, Trash2 } from "lucide-react"
import { getWatchHistory, clearWatchHistory, historyEntryToVideo } from "../utils/watchHistory"
import VideoCard from "../components/VideoCard"

function HistoryHeading({ onClear, showClear }) {
  return (
    <header className="home-heading mb-3">
      <div className="home-heading-card flex items-center justify-between gap-3 min-h-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="home-heading-icon flex items-center justify-center w-6 h-6 rounded-md shrink-0">
            <Clock className="w-3 h-3" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <h3 className="text-base font-semibold tracking-tight shrink-0">
                History
              </h3>
              <span className="home-heading-desc text-[11px] sm:text-xs opacity-90 shrink-0">·</span>
              <span className="home-heading-desc text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-[220px]">
                Videos you've watched
              </span>
            </div>
          </div>
        </div>
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="home-heading-button home-heading-button-icon shrink-0 flex items-center justify-center w-8 h-8 p-0"
            aria-label="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </header>
  )
}

export default function History() {
  const [entries, setEntries] = useState(() => getWatchHistory())

  useEffect(() => {
    setEntries(getWatchHistory())
  }, [])

  // refresh list when tab gets focus
  useEffect(() => {
    const onFocus = () => setEntries(getWatchHistory())
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  const videos = entries.map(historyEntryToVideo).filter(Boolean)

  function handleClearHistory() {
    clearWatchHistory()
    setEntries([])
  }

  return (
    <div className="p-4">
      <HistoryHeading
        showClear={videos.length > 0}
        onClear={handleClearHistory}
      />
      {videos.length === 0 ? (
        <div className="history-empty flex flex-col items-center justify-center min-h-[40vh] text-center max-w-sm mx-auto">
          <div className="history-empty-icon p-3 rounded-full mb-3">
            <Clock className="w-8 h-8 text-[#ff4500]" />
          </div>
          <h2 className="text-base font-semibold page-title mb-1.5">
            No watch history yet
          </h2>
          <p className="page-description text-sm mb-4">
            Start watching videos and your recently viewed items will appear
            here for quick access.
          </p>
          <Link
            to="/"
            className="btn-primary px-4 py-2 text-sm rounded-md font-medium"
          >
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video.id?.videoId || video.etag}
              video={video}
            />
          ))}
        </div>
      )}
    </div>
  )
}
