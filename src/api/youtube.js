/**
 * Fetch trending videos from YouTube Data API v3 (Search)
 */
export async function fetchVideos({ maxResults = 25 } = {}) {
  const q = "trending"
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${q}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`

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
