const API_BASE = "https://youtube.googleapis.com/youtube/v3"
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

/**
 * Fetch trending videos from YouTube Data API v3 (Search)
 */
export async function fetchVideos({ maxResults = 25 } = {}) {
  const q = "trending"
  const url = `${API_BASE}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(q)}&key=${API_KEY}`

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
  return data.items || []
}

/**
 * Fetch video details (snippet, statistics) for a single video
 */
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

/**
 * Fetch videos from a channel (used for "recommended" / more from same channel).
 * relatedToVideoId is deprecated and returns 400, so we use channelId instead.
 */
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

/**
 * Fetch top-level comments for a video (commentThreads.list)
 */
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
