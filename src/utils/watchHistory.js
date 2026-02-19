const STORAGE_KEY = "youtube-clone-watch-history"
const MAX_ITEMS = 100

function getWatchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    console.error("Error getting watch history")
    return []
  }
}

// add video to history (re-watch moves it to top)
function addToWatchHistory(entry) {
  if (!entry?.videoId || !entry?.title) return
  const list = getWatchHistory()
  const filtered = list.filter((item) => item.videoId !== entry.videoId)
  const newItem = {
    videoId: entry.videoId,
    title: entry.title,
    channelTitle: entry.channelTitle || "",
    thumbnailUrl: entry.thumbnailUrl || "",
    publishedAt: entry.publishedAt || new Date().toISOString(),
    watchedAt: new Date().toISOString(),
  }
  const next = [newItem, ...filtered].slice(0, MAX_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // quota or disabled localStorage
    console.error("Error adding to watch history")
  }
}

function clearWatchHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.error("Error clearing watch history")
  }
}

// shape for VideoCard
export function historyEntryToVideo(entry) {
  if (!entry?.videoId) return null
  return {
    id: { videoId: entry.videoId },
    snippet: {
      title: entry.title,
      channelTitle: entry.channelTitle,
      publishedAt: entry.publishedAt,
      thumbnails: {
        default: { url: entry.thumbnailUrl },
        medium: { url: entry.thumbnailUrl },
        high: { url: entry.thumbnailUrl },
      },
    },
  }
}

export { getWatchHistory, addToWatchHistory, clearWatchHistory }
