import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Watch from './pages/Watch'
import History from './pages/History'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Library from './pages/Library'
import Liked from './pages/Liked'
import Subscriptions from './pages/Subscriptions'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="watch" element={<Watch />} />
            <Route path="history" element={<History />} />
            <Route path="library" element={<Library />} />
            <Route path="liked" element={<Liked />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="upload" element={<Upload />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
