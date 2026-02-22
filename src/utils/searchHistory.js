const STORAGE_KEY = "youtube-clone-search-history"
const MAX_ITEMS = 15

function getSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function addToSearchHistory(term) {
  const t = (term || "").trim()
  if (!t) return
  const list = getSearchHistory()
  const filtered = list.filter((item) => item.toLowerCase() !== t.toLowerCase())
  const next = [t, ...filtered].slice(0, MAX_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {}
}

function clearSearchHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

function removeFromSearchHistory(term) {
  const t = (term || "").trim()
  if (!t) return
  const list = getSearchHistory().filter(
    (item) => item.toLowerCase() !== t.toLowerCase()
  )
  try {
    if (list.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {}
}

export { getSearchHistory, addToSearchHistory, clearSearchHistory, removeFromSearchHistory }
