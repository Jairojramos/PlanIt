// Clean dashboard header with micro-interactions for global search trigger.

import React from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950/30 backdrop-blur-md px-8 flex items-center justify-between">
      {}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <button className="w-full text-left bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors duration-200 pl-10 pr-3 py-1.5 rounded-lg text-xs text-zinc-500 flex items-center justify-between shadow-inner">
          <span>Buscar comandos...</span>
          <kbd className="bg-zinc-800 text-[10px] text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">⌘K</kbd>
        </button>
      </div>

      {}
      <div className="flex items-center space-x-4">
        <button className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900/50 transition-colors duration-150 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-white rounded-full" />
        </button>
        
        <div className="h-px w-4 bg-zinc-800 rotate-90" />

        {}
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 transition-colors group-hover:border-zinc-500">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}