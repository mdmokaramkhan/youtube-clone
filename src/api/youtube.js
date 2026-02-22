const API_BASE = "https://youtube.googleapis.com/youtube/v3"
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

// search by query
export async function searchVideos(q, { maxResults = 25 } = {}) {
  if (!q?.trim()) return []
  const url = `${API_BASE}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(q.trim())}&key=${API_KEY}`
  const response = await fetch(url)
  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`YouTube Search API error (${response.status}): ${text || response.statusText}`)
  }
  const data = await response.json()
  return data.items || []
}

// trending videos
export async function fetchVideos({ maxResults = 25 } = {}) {
  return searchVideos("trending", { maxResults })
}

// single video details
export async function fetchVideoDetails(videoId) {
  const url = `${API_BASE}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(
      `YouTube Videos API error (${response.status}): ${
        text || response.statusText
      }`
    )
  }

  const data = await response.json()
  return data.items?.[0] ?? null
}

// videos from same channel (for recommended)
export async function fetchChannelVideos(
  channelId,
  { maxResults = 20, excludeVideoId } = {}
) {
  const url = `${API_BASE}/search?part=snippet&type=video&channelId=${channelId}&maxResults=${maxResults + (excludeVideoId ? 5 : 0)}&key=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(
      `YouTube Search API error (${response.status}): ${
        text || response.statusText
      }`
    )
  }

  const data = await response.json()
  let items = data.items || []
  if (excludeVideoId) {
    items = items
      .filter((item) => item.id?.videoId !== excludeVideoId)
      .slice(0, maxResults)
  }
  return items
}

// video comments
export async function fetchVideoComments(videoId, { maxResults = 20 } = {}) {
  const url = `${API_BASE}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&textFormat=plainText&key=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(
      `YouTube Comments API error (${response.status}): ${
        text || response.statusText
      }`
    )
  }

  const data = await response.json()
  return data.items || []
}
