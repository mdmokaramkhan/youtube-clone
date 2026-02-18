import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";

const API_BASE_URL = "https://www.googleapis.com/youtube/v3";

async function fetchVideoDetails(id) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  const url = `${API_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${id}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `YouTube Video API error (${response.status}): ${
        text || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.items?.[0] || null;
}

async function fetchComments(id, maxResults = 20) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  const url = `${API_BASE_URL}/commentThreads?part=snippet&videoId=${id}&maxResults=${maxResults}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `YouTube Comments API error (${response.status}): ${
        text || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.items || [];
}

async function fetchUpNextVideos(currentId, maxResults = 12) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  const url = `${API_BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `YouTube Up Next API error (${response.status}): ${
        text || response.statusText
      }`
    );
  }

  const data = await response.json();
  const items = data.items || [];

  // Filter out the currently playing video if it appears
  return items.filter((item) => item.id !== currentId);
}

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [upNext, setUpNext] = useState([]);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [item, commentItems, upNextItems] = await Promise.all([
          fetchVideoDetails(id),
          fetchComments(id),
          fetchUpNextVideos(id),
        ]);
        if (!isMounted) return;
        setVideo(item);
        setComments(commentItems);
        setUpNext(upNextItems);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load video. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const snippet = video?.snippet;
  const statistics = video?.statistics;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          {id && (
            <iframe
              title={snippet?.title || "YouTube video player"}
              src={`https://www.youtube.com/embed/${id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>

        <div className="mt-4">
          {loading && (
            <p className="text-sm text-gray-400">Loading video details...</p>
          )}

          {error && !loading && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {video && !loading && !error && (
            <>
              {/* Title */}
              <h1 className="text-lg md:text-2xl font-semibold text-white mb-2">
                {snippet?.title}
              </h1>

              {/* Meta row: views + date + actions */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                <div className="text-xs md:text-sm text-gray-400">
                  {statistics?.viewCount && (
                    <span>
                      {Number(statistics.viewCount).toLocaleString()} views
                    </span>
                  )}
                  {snippet?.publishedAt && (
                    <span className="ml-2">
                      •{" "}
                      {new Date(snippet.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-[#272727] px-3 py-1.5 text-gray-100 hover:bg-[#3f3f3f] transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>
                      {statistics?.likeCount
                        ? Number(statistics.likeCount).toLocaleString()
                        : "Like"}
                    </span>
                    <span className="mx-1 text-gray-500">|</span>
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-[#272727] px-3 py-1.5 text-gray-100 hover:bg-[#3f3f3f] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-[#272727] p-1.5 text-gray-100 hover:bg-[#3f3f3f] transition-colors"
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Channel + description card */}
              <div className="bg-[#181818] rounded-xl p-3 md:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-600 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {snippet?.channelTitle}
                      </span>
                      <span className="text-xs text-gray-400">
                        {statistics?.viewCount
                          ? `${Number(
                              statistics.viewCount
                            ).toLocaleString()} views`
                          : "Views hidden"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-white text-black px-4 py-1.5 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>

                {snippet?.description && (
                  <div className="mt-3 text-sm text-gray-200 whitespace-pre-line max-h-60 overflow-y-auto">
                    {snippet.description}
                  </div>
                )}
              </div>

                {/* Comments */}
                <div className="mt-6">
                  {/* Header with sort dropdown */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white">
                      {comments.length > 0
                        ? `${comments.length.toLocaleString()} Comments`
                        : "Comments"}
                    </h2>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white"
                    >
                      <span>Top comments</span>
                      <span className="text-gray-500">▼</span>
                    </button>
                  </div>

                  {/* Comment input mock (like YouTube's "Add a comment") */}
                  <div className="flex items-start gap-3 mb-6">
                    <div className="h-9 w-9 rounded-full bg-gray-600 shrink-0" />
                    <div className="flex-1 border-b border-[#3f3f3f] pb-1">
                      <p className="text-sm text-gray-400">
                        Add a public comment...
                      </p>
                    </div>
                  </div>

                  {comments.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No comments to display.
                    </p>
                  )}

                  <ul className="space-y-6">
                    {comments.map((thread) => {
                      const top = thread.snippet?.topLevelComment?.snippet;
                      if (!top) return null;

                      const publishedAt = top.publishedAt
                        ? new Date(top.publishedAt)
                        : null;
                      const likeCount =
                        typeof top.likeCount === "number"
                          ? top.likeCount
                          : undefined;
                      const replyCount =
                        typeof thread.snippet?.totalReplyCount === "number"
                          ? thread.snippet.totalReplyCount
                          : 0;

                      return (
                        <li
                          key={thread.id}
                          className="flex gap-3 text-sm text-gray-100"
                        >
                          {top.authorProfileImageUrl ? (
                            <img
                              src={top.authorProfileImageUrl}
                              alt={top.authorDisplayName}
                              className="h-9 w-9 rounded-full shrink-0 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-gray-600 shrink-0" />
                          )}
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            {/* Author row */}
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="font-medium text-gray-200">
                                {top.authorDisplayName}
                              </span>
                              {publishedAt && (
                                <span>
                                  {publishedAt.toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {/* Comment text */}
                            <div className="text-sm text-gray-100">
                              {top.textDisplay || top.textOriginal}
                            </div>

                            {/* Actions row: like / reply / view replies */}
                            <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 hover:text-white"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {likeCount !== undefined && likeCount > 0 && (
                                  <span>
                                    {likeCount.toLocaleString()}
                                  </span>
                                )}
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 hover:text-white"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                className="font-semibold hover:text-white"
                              >
                                Reply
                              </button>
                            </div>

                            {/* View replies */}
                            {replyCount > 0 && (
                              <button
                                type="button"
                                className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
                              >
                                <span>View {replyCount} replies</span>
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
            </>
          )}
        </div>
      </div>

      <aside className="w-full lg:w-80 xl:w-96">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-3"
        >
          ← Back to home
        </Link>

        {/* Up next header with autoplay toggle mock */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white">Recommended</h2>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Autoplay</span>
            <div className="w-9 h-5 rounded-full bg-[#3f3f3f] flex items-center px-0.5">
              <div className="w-4 h-4 rounded-full bg-white translate-x-3" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {upNext.map((item) => {
            const vId = item.id;
            const vSnippet = item.snippet;
            const thumb =
              vSnippet?.thumbnails?.medium || vSnippet?.thumbnails?.default;
            const views = item.statistics?.viewCount
              ? Number(item.statistics.viewCount).toLocaleString()
              : null;

            if (!vId || !vSnippet) return null;

            return (
              <Link
                key={vId}
                to={`/watch/${vId}`}
                className="flex gap-2 hover:bg-[#262626] rounded-xl p-1.5 transition-colors"
              >
                {thumb && (
                  <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                    <img
                      src={thumb.url}
                      alt={vSnippet.title || "Up next video thumbnail"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Duration mock in bottom-right corner */}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded">
                      12:34
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs font-semibold text-white line-clamp-2">
                    {vSnippet.title}
                  </p>
                  <p className="text-[11px] text-gray-400 line-clamp-1">
                    {vSnippet.channelTitle}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {views ? `${views} views` : "Views hidden"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

export default Watch;

