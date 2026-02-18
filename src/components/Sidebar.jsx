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
  const base = 'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors border-l-2'
  const active = dark ? 'bg-[#1e1e1f] text-[#ff4500] border-l-[#ff4500]' : 'bg-neutral-100 text-[#ff4500] border-l-[#ff4500]'
  const inactive = dark
    ? 'border-l-transparent text-[#b8b8b8] hover:bg-[#1e1e1f] hover:text-[#ff4500]'
    : 'border-l-transparent text-neutral-600 hover:bg-neutral-100 hover:text-[#ff4500]'
  const IconEl = Icon

  return (
    <Link to={to} className={`${base} ${isActive ? active : inactive}`}>
      <IconEl className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
      {label}
    </Link>
  )
}

function SidebarGroup({ title, children, dark }) {
  const titleClass = dark ? 'text-[#6b6b6c]' : 'text-neutral-400'
  return (
    <div className="mb-4">
      <h2 className={`px-2.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider ${titleClass}`}>{title}</h2>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

export default function Sidebar({ top = 52, width = 200 }) {
  const location = useLocation()
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const isActive = (to) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
  const asideClass = dark ? 'bg-[#111112] border-[#2a2a2b]' : 'bg-white border-neutral-200'

  const linkGroups = [
    { title: 'Main', links: mainLinks },
    { title: 'Explore', links: exploreLinks },
    { title: 'App', links: appLinks },
  ]

  return (
    <aside
      className={`fixed left-0 bottom-0 z-40 border-r overflow-y-auto ${asideClass}`}
      style={{ top, width, paddingTop: 12 }}
    >
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
