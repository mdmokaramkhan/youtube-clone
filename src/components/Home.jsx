
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

async function fetchVideos({ maxResults = 25 } = {}) {
  const q = "trending";
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${q}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `YouTube Search API error (${response.status}): ${
        text || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.items || [];
}

const CATEGORY_CHIPS = [
  "All",
  "Music",
  "Live",
  "Gaming",
  "News",
  "Podcasts",
  "Programming",
  "Mixes",
  "Recently uploaded",
  "Watched",
  "New to you",
];

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const then = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

function getMockDuration(index) {
  // Just to make the UI feel real without extra data
  const mins = 3 + (index % 20);
  const secs = (index * 17) % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewingId, setPreviewingId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadVideos() {
      try {
        setLoading(true);
        setError("");
        // Initial load uses a generic "trending" query
        const items = await fetchVideos({ maxResults: 24 });
        if (!isMounted) return;
        setVideos(items);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load videos. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardMouseEnter = (videoId) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setPreviewingId(videoId);
    }, 500); // small delay to avoid accidental previews
  };

  const handleCardMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setPreviewingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Category chips row (like YouTube filters) */}
      <div className="bg-[#0f0f0f] pb-1">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pr-1">
          {CATEGORY_CHIPS.map((chip) => {
            const active = chip === activeCategory;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveCategory(chip)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs md:text-sm border ${
                  active
                    ? "bg-white text-black border-white"
                    : "bg-[#272727] text-gray-100 border-[#3f3f3f] hover:bg-[#3f3f3f]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="aspect-video rounded-xl bg-[#202020]" />
              <div className="flex gap-3 pt-3">
                <div className="mt-1 h-9 w-9 rounded-full bg-[#202020]" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 bg-[#202020] rounded w-5/6" />
                  <div className="h-3 bg-[#202020] rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <section
          aria-label="Search results"
          className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {videos.map((video, index) => {
            const { id, snippet } = video;
            const videoId = id?.videoId;
            if (!videoId) return null;
            const thumbnail =
              snippet?.thumbnails?.medium || snippet?.thumbnails?.high;
            const publishedAt = snippet?.publishedAt;
            const timeAgo = formatTimeAgo(publishedAt);
            const duration = getMockDuration(index);

            return (
              <Link
                key={videoId}
                to={`/watch/${videoId}`}
                onMouseEnter={() => handleCardMouseEnter(videoId)}
                onMouseLeave={handleCardMouseLeave}
              >
                <article className="cursor-pointer">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    {previewingId === videoId && (
                      <iframe
                        title={snippet?.title || "Video preview"}
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen={false}
                      />
                    )}
                    {previewingId !== videoId && thumbnail && (
                      <img
                        src={thumbnail.url}
                        alt={snippet?.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    {/* Duration badge */}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded">
                      {duration}
                    </span>
                  </div>
                  <div className="flex gap-3 p-3">
                    <div className="mt-1 h-9 w-9 rounded-full bg-gray-600 shrink-0" />
                    <div className="flex flex-col gap-1 min-w-0">
                      <h2 className="text-sm font-semibold text-white line-clamp-2">
                        {snippet?.title || "Untitled video"}
                      </h2>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {snippet?.channelTitle || "Unknown channel"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {timeAgo && timeAgo !== "Today"
                          ? timeAgo
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Home;
