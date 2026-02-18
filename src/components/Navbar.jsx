import React from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Mic, Bell, User, Video } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-3 md:px-6 h-14 bg-[#0f0f0f]">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-[#272727] text-gray-200"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <span className="w-6 h-6 bg-red-600 rounded-sm" />
            <span className="text-white font-semibold tracking-tight">
              MyTube
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-4">
        <form
          className="hidden md:flex items-stretch max-w-2xl w-full"
          role="search"
        >
          <div className="flex-1 flex items-center bg-[#121212] border border-[#303030] rounded-l-full overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent px-4 py-1.5 text-sm text-white outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-16 flex items-center justify-center bg-[#222222] border border-l-0 border-[#303030] rounded-r-full text-gray-300 hover:bg-[#303030]"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="ml-2 p-2.5 rounded-full bg-[#181818] text-gray-200 hover:bg-[#272727]"
            aria-label="Search with your voice"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Create button (like YouTube "Create") */}
        <Link
          to="/upload"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-gray-100 text-sm font-medium px-3 py-1.5"
          aria-label="Create"
        >
          <Video className="w-4 h-4" />
          <span className="hidden md:inline">Create</span>
        </Link>
        <button
          type="button"
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#181818] text-gray-200 hover:bg-[#272727]"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <Link
          to="/profile"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3ea6ff] text-black font-semibold text-xs"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
