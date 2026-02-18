import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = ({children}) => {
    return (
        <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-[#0f0f0f] px-3 md:px-6 py-4">
              {children}
            </main>
          </div>
        </div>
    );
}

export default Layout;
