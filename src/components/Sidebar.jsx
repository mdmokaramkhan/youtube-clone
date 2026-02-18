import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  Clock3,
  Flame,
  ListVideo,
  PlaySquare,
  ThumbsUp,
  Music2,
  Gamepad2,
  Film,
  Trophy,
  Radio,
  Settings,
  Flag,
  HelpCircle,
  MessageCircleMore,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <aside className="hidden md:flex flex-col w-60 bg-[#0f0f0f] text-sm text-gray-200 pt-2 pb-4 overflow-y-auto border-r border-[#272727]">
      <nav>
        {/* Primary section */}
        <div className="px-2 pb-2 border-b border-[#272727]">
          <SidebarItem
            icon={<HomeIcon className="w-5 h-5" />}
            label="Home"
            to="/"
            active={isActive("/")}
          />
          <SidebarItem
            icon={<Flame className="w-5 h-5" />}
            label="Trending"
            to="/trending"
            active={isActive("/trending")}
          />
          <SidebarItem
            icon={<PlaySquare className="w-5 h-5" />}
            label="Subscriptions"
            to="/subscriptions"
            active={isActive("/subscriptions")}
          />
        </div>

        {/* Explore section (Music, Gaming, etc.) */}
        <div className="px-2 pt-2 pb-3 border-b border-[#272727]">
          <p className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Explore
          </p>
          <SidebarItem
            icon={<Music2 className="w-5 h-5" />}
            label="Music"
            to="/music"
            active={isActive("/music")}
          />
          <SidebarItem
            icon={<Gamepad2 className="w-5 h-5" />}
            label="Gaming"
            to="/gaming"
            active={isActive("/gaming")}
          />
          <SidebarItem
            icon={<Film className="w-5 h-5" />}
            label="Movies & TV"
            to="/movies"
            active={isActive("/movies")}
          />
          <SidebarItem
            icon={<Trophy className="w-5 h-5" />}
            label="Sports"
            to="/sports"
            active={isActive("/sports")}
          />
          <SidebarItem
            icon={<Radio className="w-5 h-5" />}
            label="Live"
            to="/live"
            active={isActive("/live")}
          />
        </div>

        {/* Library section */}
        <div className="px-2 pt-2 pb-3 border-b border-[#272727]">
          <SidebarItem
            icon={<ListVideo className="w-5 h-5" />}
            label="Library"
            to="/library"
            active={isActive("/library")}
          />
          <SidebarItem
            icon={<Clock3 className="w-5 h-5" />}
            label="History"
            to="/history"
            active={isActive("/history")}
          />
          <SidebarItem
            icon={<ThumbsUp className="w-5 h-5" />}
            label="Liked videos"
            to="/liked"
            active={isActive("/liked")}
          />
        </div>

        {/* More from YouTube */}
        <div className="px-2 pt-2 pb-3 border-b border-[#272727]">
          <p className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            More from MyTube
          </p>
          <SidebarItem
            icon={<PlaySquare className="w-5 h-5" />}
            label="MyTube Premium"
            to="/premium"
            active={isActive("/premium")}
          />
          <SidebarItem
            icon={<Music2 className="w-5 h-5" />}
            label="MyTube Music"
            to="/yt-music"
            active={isActive("/yt-music")}
          />
          <SidebarItem
            icon={<Gamepad2 className="w-5 h-5" />}
            label="Gaming"
            to="/gaming"
            active={isActive("/gaming")}
          />
        </div>

        {/* Settings / help section */}
        <div className="px-2 pt-2 pb-3 border-b border-[#272727]">
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            to="/settings"
            active={isActive("/settings")}
          />
          <SidebarItem
            icon={<Flag className="w-5 h-5" />}
            label="Report history"
            to="/report-history"
            active={isActive("/report-history")}
          />
          <SidebarItem
            icon={<HelpCircle className="w-5 h-5" />}
            label="Help"
            to="/help"
            active={isActive("/help")}
          />
          <SidebarItem
            icon={<MessageCircleMore className="w-5 h-5" />}
            label="Send feedback"
            to="/feedback"
            active={isActive("/feedback")}
          />
        </div>

        {/* Footer links */}
        <div className="px-4 pt-3 space-y-2 text-[11px] text-gray-500">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>About</span>
            <span>Press</span>
            <span>Copyright</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>Contact us</span>
            <span>Creators</span>
            <span>Advertise</span>
            <span>Developers</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Policy &amp; Safety</span>
          </div>
          <p className="text-[10px] text-gray-600 pt-1">
            © {new Date().getFullYear()} MyTube
          </p>
        </div>
      </nav>
    </aside>
  );
};

const SidebarItem = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-5 px-3 py-2 rounded-xl transition-colors ${
        active ? "bg-[#272727] font-medium" : "hover:bg-[#272727]"
      }`}
    >
      <span className="text-gray-200">{icon}</span>
      <span className="text-sm text-gray-200">{label}</span>
    </Link>
  );
};

export default Sidebar;
