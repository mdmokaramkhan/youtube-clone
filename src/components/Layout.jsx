import { Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const NAV_H = 52
const SIDEBAR_W = 200

export default function Layout() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const bgClass = dark ? 'bg-[#0c0c0d] text-[#d7dadc]' : 'bg-[#f5f5f5] text-[#1a1a1a]'

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Navbar height={NAV_H} />
      <Sidebar top={NAV_H} width={SIDEBAR_W} />
      <main
        className={`min-h-screen transition-colors duration-200 ${bgClass}`}
        style={{ paddingTop: NAV_H, paddingLeft: SIDEBAR_W }}
      >
        <Outlet />
      </main>
    </div>
  )
}
