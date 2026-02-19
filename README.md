# 📺 WatchTube

> YouTube-style frontend built with **React** and **Vite**. Trending feed, watch page with comments, watch history (localStorage), and a settings page with dark/light theme.

---

## ✨ Features

| | Feature | Description |
|---|--------|-------------|
| 🏠 | **Home** | Trending videos grid (YouTube Data API v3), skeleton loading, error state with retry |
| ▶️ | **Watch** | Embedded player, title, channel, views, description, comments, recommended sidebar |
| 📜 | **History** | Watched videos saved in localStorage, list + clear button, empty state with CTA |
| ⚙️ | **Settings** | Card layout, dark/light toggle (persisted), notification & safe-search toggles (UI) |

---

## 🛠 Tech stack

| | |
|---|--|
| **UI** | React 18, Vite, React Router, lucide-react |
| **Styles** | Custom CSS (Tailwind-style utilities in `src/index.css`) |
| **Data** | YouTube Data API v3, localStorage (history + theme) |

---

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

Create `.env` in the project root:

```env
VITE_YOUTUBE_API_KEY=your_youtube_data_api_key_here
```

Get a key from [Google Cloud](https://console.cloud.google.com/) (YouTube Data API v3).

### 3. Run

```bash
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`).

### 4. Build & preview

```bash
npm run build
npm run preview
```

---

## 📁 Project structure

| Path | Purpose |
|------|--------|
| `src/pages/Home.jsx` | Trending feed grid |
| `src/pages/Watch.jsx` | Player, details, comments, recommended |
| `src/pages/History.jsx` | Watch history list, clear history |
| `src/pages/Settings.jsx` | Appearance, notifications, data, about |
| `src/components/` | Layout, navbar, video cards, shared UI |
| `src/api/youtube.js` | YouTube Data API wrapper |
| `src/utils/watchHistory.js` | localStorage watch history helpers |

---

## 💡 Notes

- **Frontend only** — data from YouTube API and browser localStorage; no backend or auth.
- Suited for **UI/UX demo** and learning.
