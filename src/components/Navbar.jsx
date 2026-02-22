import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlayCircle, Sun, Moon, User, Search as SearchIcon, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { getSearchHistory, removeFromSearchHistory } from '../utils/searchHistory'

const RECENT_SEARCH_MAX = 5

export default function Navbar({ height }) {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const dark = theme === 'dark'

  const [searchValue, setSearchValue] = useState('')
  const [showRecent, setShowRecent] = useState(false)
  const [recentList, setRecentList] = useState(() => getSearchHistory())
  const searchRef = useRef(null)

  useEffect(() => {
    setRecentList(getSearchHistory())
  }, [showRecent])

  const filtered = searchValue.trim()
    ? recentList.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      )
    : recentList
  const recentSlice = filtered.slice(0, RECENT_SEARCH_MAX)

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowRecent(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearchSubmit(e) {
    e?.preventDefault()
    const q = searchValue.trim()
    if (!q) return
    setShowRecent(false)
    navigate(`/results?q=${encodeURIComponent(q)}`)
  }

  function handleRecentSelect(term) {
    setSearchValue(term)
    setShowRecent(false)
    navigate(`/results?q=${encodeURIComponent(term)}`)
  }

  function handleRemoveRecent(e, term) {
    e.stopPropagation()
    removeFromSearchHistory(term)
    setRecentList(getSearchHistory())
  }

  const headerClass = dark ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-neutral-200'
  const navLinkClass = dark
    ? 'text-[#d7dadc] hover:bg-[#272729] hover:text-[#ff4500]'
    : 'text-neutral-700 hover:bg-neutral-100 hover:text-[#ff4500]'
  const profileClass = dark
    ? 'bg-[#272729] text-[#d7dadc] hover:bg-[#343536] hover:ring-2 hover:ring-[#ff4500]'
    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:ring-2 hover:ring-[#ff4500]'
  const inputClass = dark
    ? 'bg-[#272729] border-[#3a3a3f] text-[#d7dadc] placeholder-[#6b6d70] focus:border-[#ff4500]'
    : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:border-[#ff4500]'
  const dropdownClass = dark
    ? 'bg-[#161618] border border-[#2a2a2d]'
    : 'bg-white border border-neutral-200'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 gap-3 border-b ${headerClass}`}
      style={{ height: height || 52 }}
    >
      <Link
        to="/"
        className="navbar-logo flex items-center gap-1.5 ml-1 text-[#ff4500] font-bold text-lg tracking-tight leading-none hover:text-[#ff5722] transition-colors shrink-0"
      >
        <PlayCircle className="w-6 h-6 shrink-0" strokeWidth={2} aria-hidden />
        <span>WatchTube</span>
      </Link>

      <div ref={searchRef} className="flex-1 flex justify-center min-w-0 relative">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <div className="relative flex items-center">
            <SearchIcon
              className="absolute left-3 w-4 h-4 pointer-events-none opacity-60"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setShowRecent(true)}
              placeholder="Search"
              aria-label="Search videos"
              className={`w-full pl-9 pr-3 h-9 rounded-full border text-sm outline-none transition-colors ${inputClass}`}
            />
          </div>
          {showRecent && recentSlice.length > 0 && (
            <ul
              className={`absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden ${dropdownClass}`}
            >
              {recentSlice.map((term) => (
                <li key={term} className="flex items-center group">
                  <button
                    type="button"
                    onClick={() => handleRecentSelect(term)}
                    className={`flex-1 min-w-0 text-left px-3 py-2 text-sm truncate ${dark ? 'text-[#d7dadc]' : 'text-neutral-700'}`}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveRecent(e, term)}
                    className={`shrink-0 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${dark ? 'text-[#6b6d70] hover:text-[#d7dadc]' : 'text-neutral-400 hover:text-neutral-600'}`}
                    aria-label={`Remove "${term}"`}
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      <nav className="flex items-center gap-2 shrink-0">
        <Link to="/upload" className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${navLinkClass}`}>
          Upload
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className={`theme-toggle-btn flex items-center justify-center w-8 h-8 rounded-full p-0 border-0 transition-all shrink-0 ${profileClass}`}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={dark ? 'Light theme' : 'Dark theme'}
        >
          {dark ? <Sun className="w-4 h-4 shrink-0" strokeWidth={2} /> : <Moon className="w-4 h-4 shrink-0" strokeWidth={2} />}
        </button>
        <Link
          to="/profile"
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0 ${profileClass}`}
          aria-label="Profile"
        >
          <User className="w-4 h-4" />
        </Link>
      </nav>
    </header>
  )
}
