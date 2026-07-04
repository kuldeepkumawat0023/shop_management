import { Bell, Search, UserCircle } from "lucide-react";

export default function TopNavBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center flex-1 gap-4">
        {/* Simple Global Search Placeholder */}
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search branches, users, or tickets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-md transition-colors text-left">
          <UserCircle className="h-8 w-8 text-gray-400" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">Super Admin</p>
            <p className="text-xs text-gray-500">System Root</p>
          </div>
        </button>
      </div>
    </header>
  );
}
