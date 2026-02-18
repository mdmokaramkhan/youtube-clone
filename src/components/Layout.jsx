import { Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const bgClass = dark ? 'bg-[#0c0c0d] text-[#d7dadc]' : 'bg-[#f6f6f6] text-[#1c1c1c]'

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Navbar />
      <Sidebar />
      <main className={`pt-16 pl-60 min-h-screen ${bgClass}`}>
        <Outlet />
      </main>
    </div>
  )
}
