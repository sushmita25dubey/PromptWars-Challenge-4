import React, { useState } from 'react';
import { useAppStore } from '../store';
import {
  LayoutDashboard,
  MessageSquareCode,
  Users,
  Bus,
  Accessibility,
  Languages,
  AlertTriangle,
  Award,
  Leaf,
  Layers,
  Server,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onModuleChange: (moduleId: string) => void;
  activeModule: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onModuleChange, activeModule }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAppStore((state) => state.user);
  const role = user?.role || 'fan';

  // Role-based links mapping
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['fan', 'volunteer', 'organizer', 'security', 'admin'] },
    { id: 'fan-assistant', name: 'AI Fan Assistant', icon: MessageSquareCode, roles: ['fan', 'volunteer', 'admin'] },
    { id: 'crowd-mgmt', name: 'Crowd Control', icon: Users, roles: ['fan', 'security', 'organizer', 'admin'] },
    { id: 'transport-ai', name: 'Transport AI', icon: Bus, roles: ['fan', 'volunteer', 'organizer', 'admin'] },
    { id: 'accessibility', name: 'Accessibility Center', icon: Accessibility, roles: ['fan', 'volunteer', 'organizer', 'admin'] },
    { id: 'translation', name: 'Live Translation', icon: Languages, roles: ['fan', 'volunteer', 'organizer', 'admin'] },
    { id: 'emergency', name: 'Emergency AI', icon: AlertTriangle, roles: ['fan', 'volunteer', 'security', 'admin'] },
    { id: 'volunteer-hub', name: 'Volunteer Hub', icon: Award, roles: ['volunteer', 'admin'] },
    { id: 'sustainability', name: 'Sustainability Hub', icon: Leaf, roles: ['fan', 'organizer', 'admin'] },
    { id: 'digital-twin', name: 'Digital Twin 3D', icon: Layers, roles: ['security', 'organizer', 'admin'] },
    { id: 'admin-command', name: 'Command Center', icon: Server, roles: ['security', 'organizer', 'admin'] },
    { id: 'announcement-gen', name: 'Announcement Gen', icon: Megaphone, roles: ['organizer', 'admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside 
      className={`h-[calc(100vh-64px)] border-r border-slate-800/80 bg-slate-900 transition-all duration-300 flex flex-col justify-between sticky top-16 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
        <nav className="px-3 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group focus:outline-none focus:ring-2 focus:ring-fifa-gold ${
                  isActive
                    ? 'bg-slate-800 text-fifa-gold border-l-4 border-fifa-gold pl-2 shadow-inner shadow-slate-950/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
                aria-label={item.name}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive ? 'text-fifa-gold' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800/60 flex items-center justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand sidebar panel" : "Collapse sidebar panel"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
};
