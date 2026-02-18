import { Link } from 'react-router-dom'
import { PlayCircle, Sun, Moon, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  const headerClass = dark ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-neutral-200'
  const navLinkClass = dark
    ? 'text-[#d7dadc] hover:bg-[#272729] hover:text-[#ff4500]'
    : 'text-neutral-700 hover:bg-neutral-100 hover:text-[#ff4500]'
  const themeBtnClass = dark
    ? 'bg-[#272729] text-[#d7dadc] hover:bg-[#343536] hover:text-[#ff4500] hover:ring-2 hover:ring-[#ff4500]'
    : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 hover:text-[#ff4500] hover:ring-2 hover:ring-[#ff4500]'
  const profileClass = dark
    ? 'bg-[#272729] text-[#d7dadc] hover:bg-[#343536] hover:ring-2 hover:ring-[#ff4500]'
    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:ring-2 hover:ring-[#ff4500]'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 gap-6 border-b ${headerClass}`}>
      <Link
        to="/"
        className="navbar-logo flex items-center gap-2 text-[#ff4500]! font-black! text-2xl tracking-tighter leading-none hover:text-[#ff5722]! transition-colors shrink-0 py-1"
      >
        <PlayCircle className="w-8 h-8 shrink-0" strokeWidth={2} aria-hidden />
        <span>WatchTube</span>
      </Link>
      <div className="flex-1 min-w-4" />
      <nav className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className={`theme-toggle-btn flex items-center justify-center w-9 h-9 rounded-full p-0 border-0 transition-colors shrink-0 ${themeBtnClass}`}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={dark ? 'Light theme' : 'Dark theme'}
        >
          {dark ? <Sun className="w-5 h-5 shrink-0" strokeWidth={2} /> : <Moon className="w-5 h-5 shrink-0" strokeWidth={2} />}
        </button>
        <Link to="/upload" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${navLinkClass}`}>
          Upload
        </Link>
        <Link
          to="/profile"
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all shrink-0 ${profileClass}`}
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
        </Link>
      </nav>
    </header>
  )
}
