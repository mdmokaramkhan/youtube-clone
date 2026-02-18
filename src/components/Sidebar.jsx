import { Link, useLocation } from 'react-router-dom'
import { Home, PlayCircle, History, Library, Heart, Bell, Settings } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const mainLinks = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/watch', label: 'Watch', Icon: PlayCircle },
  { to: '/history', label: 'History', Icon: History },
]
const exploreLinks = [
  { to: '/library', label: 'Library', Icon: Library },
  { to: '/liked', label: 'Liked', Icon: Heart },
  { to: '/subscriptions', label: 'Subscriptions', Icon: Bell },
]
const appLinks = [{ to: '/settings', label: 'Settings', Icon: Settings }]

function NavLink({ to, label, Icon, isActive, dark }) {
  const base = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4'
  const active = dark ? 'bg-[#272729] text-[#ff4500] border-l-[#ff4500]' : 'bg-neutral-100 text-[#ff4500] border-l-[#ff4500]'
  const inactive = dark
    ? 'border-l-transparent text-[#d7dadc] hover:bg-[#272729] hover:text-[#ff4500]'
    : 'border-l-transparent text-neutral-700 hover:bg-neutral-100 hover:text-[#ff4500]'
  const IconEl = Icon

  return (
    <Link to={to} className={`${base} ${isActive ? active : inactive}`}>
      <IconEl className="w-5 h-5 shrink-0" strokeWidth={2} aria-hidden />
      {label}
    </Link>
  )
}

function SidebarGroup({ title, children, dark }) {
  const titleClass = dark ? 'text-[#818384]' : 'text-neutral-500'
  return (
    <div className="mb-6">
      <h2 className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${titleClass}`}>{title}</h2>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const isActive = (to) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
  const asideClass = dark ? 'bg-[#1a1a1b] border-[#343536]' : 'bg-white border-neutral-200'

  const linkGroups = [
    { title: 'Main', links: mainLinks },
    { title: 'Explore', links: exploreLinks },
    { title: 'App', links: appLinks },
  ]

  return (
    <aside className={`fixed top-16 left-0 bottom-0 z-40 w-60 border-r pt-6 overflow-y-auto ${asideClass}`}>
      <div className="px-2">
        {linkGroups.map(({ title, links }) => (
          <SidebarGroup key={title} title={title} dark={dark}>
            {links.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} label={label} Icon={Icon} isActive={isActive(to)} dark={dark} />
            ))}
          </SidebarGroup>
        ))}
      </div>
    </aside>
  )
}
