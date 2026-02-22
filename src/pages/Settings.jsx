import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Settings as SettingsIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { getSearchHistory, clearSearchHistory } from "../utils/searchHistory"

function SettingsHeading() {
  return (
    <header className="home-heading mb-3">
      <div className="home-heading-card flex items-center justify-between gap-3 min-h-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="home-heading-icon flex items-center justify-center w-6 h-6 rounded-md shrink-0">
            <SettingsIcon className="w-3 h-3" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <h3 className="text-base font-semibold tracking-tight shrink-0">
                Settings
              </h3>
              <span className="home-heading-desc text-[11px] sm:text-xs opacity-90 shrink-0">·</span>
              <span className="home-heading-desc text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-[220px]">
                Account and preferences
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 border-b border-[#6b6d70] last:border-b-0 [data-theme='light']:border-neutral-200">
      <div className="min-w-0">
        <p className="text-sm font-medium page-title">{label}</p>
        {description && (
          <p className="text-xs page-description mt-1">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="settings-toggle"
    >
      <span className="settings-toggle-thumb" />
    </button>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [safeSearch, setSafeSearch] = useState(true)
  const [searchHistory, setSearchHistory] = useState(() => getSearchHistory())

  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  useEffect(() => {
    const onFocus = () => setSearchHistory(getSearchHistory())
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  function handleClearSearchHistory() {
    clearSearchHistory()
    setSearchHistory([])
  }

  return (
    <div className="p-4 sm:p-5 w-full max-w-full">
      <SettingsHeading />

      <div className="mt-4 flex flex-col gap-4 w-full">
        <div className="watch-details-card rounded-lg p-4 sm:p-5 w-full">
          <h3 className="text-xs font-semibold page-title mb-4 uppercase tracking-wide">
            Appearance
          </h3>
          <SettingRow
            label="Dark mode"
            description="Use dark theme for the app"
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full home-heading-button text-xs sm:text-sm"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" strokeWidth={2} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={2} />
              )}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </SettingRow>
        </div>

        <div className="watch-details-card rounded-lg p-4 sm:p-5 w-full">
          <h3 className="text-xs font-semibold page-title mb-4 uppercase tracking-wide">
            Data & privacy
          </h3>
          <SettingRow
            label="Watch history"
            description="View or clear videos you've watched"
          >
            <Link
              to="/history"
              className="text-sm font-medium text-[#ff4500] hover:underline"
            >
              Open history
            </Link>
          </SettingRow>
          <SettingRow
            label="Safe search"
            description="Filter mature or sensitive content"
          >
            <Toggle
              checked={safeSearch}
              onChange={setSafeSearch}
              ariaLabel="Safe search"
            />
          </SettingRow>
        </div>

        <div className="watch-details-card rounded-lg p-4 sm:p-5 w-full">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-semibold page-title uppercase tracking-wide">
              Search history
            </h3>
            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearSearchHistory}
                className="text-xs font-medium text-[#ff4500] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          {searchHistory.length === 0 ? (
            <p className="text-sm page-description">No recent searches.</p>
          ) : (
            <ul className="text-sm page-description space-y-2">
              {searchHistory.slice(0, 5).map((term) => (
                <li key={term} className="truncate">
                  {term}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="watch-details-card rounded-lg p-4 sm:p-5 w-full">
          <h3 className="text-xs font-semibold page-title mb-4 uppercase tracking-wide">
            About
          </h3>
          <p className="text-sm page-description py-2">
            YouTube-style clone. Data is stored in your browser (localStorage).
          </p>
          <SettingRow
            label="Version"
            description="App version"
          >
            <span className="text-xs page-description">1.0.0</span>
          </SettingRow>
        </div>
      </div>
    </div>
  )
}
