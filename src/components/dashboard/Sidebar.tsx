"use main";
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, CheckSquare, BarChart2, Settings, HelpCircle } from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, current: true },
  { name: "Tareas", icon: CheckSquare, current: false },
  { name: "Métricas", icon: BarChart2, current: false },
  { name: "Configuración", icon: Settings, current: false },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <aside className="w-64 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-md flex flex-col justify-between p-4 h-full hidden md:flex select-none">
      <div className="space-y-6">
        {}
        <div className="flex items-center space-x-2 px-2 py-3">
          <div className="h-6 w-6 rounded-md bg-white flex items-center justify-center">
            <div className="h-2 w-2 bg-zinc-950 rounded-sm" />
          </div>
          <span className="font-semibold tracking-tight text-base text-zinc-100">PlanIt</span>
        </div>

        {}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isSelected = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className="relative w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 text-zinc-400 hover:text-zinc-200"
              >
                {}
                {isSelected && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-zinc-900 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                <span className={isSelected ? "text-zinc-100" : ""}>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {}
      <div className="pt-4 border-t border-zinc-900">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span>Soporte Técnico</span>
        </button>
      </div>
    </aside>
  );
}