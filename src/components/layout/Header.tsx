import React from 'react';
import { Search, MonitorPlay, Play, Menu, PanelLeftClose, PanelLeft, ShieldCheck } from 'lucide-react';

import { TypographySelector } from './TypographySelector';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleSidebarCollapse: () => void;
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  onNavigate: (pageId: string) => void;
  activePage: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleSidebarCollapse,
  onToggleMobileSidebar,
  isSidebarCollapsed,
  onNavigate,
  activePage,
}) => {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[#23272F] bg-[#08090B]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between no-print">
      {/* Left: Sidebar Collapse & Wordmark */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-[8px] text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#13161B] transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop sidebar toggle button */}
        <button
          onClick={onToggleSidebarCollapse}
          className="hidden lg:flex p-1.5 rounded-[8px] text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#13161B] transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* SALESTORM Wordmark with subtle traffic flow indicator */}
        <div
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="flex items-center gap-1 font-mono font-bold tracking-tight text-sm text-[#F5F7FA]">
            <span className="flex h-2 w-2 rounded-full bg-[#10B981]" />
            <span>SALESTORM</span>
          </div>
          <span className="text-[#323846]">/</span>
          <span className="text-xs font-mono text-[#9CA3AF] uppercase hidden sm:inline">
            {activePage}
          </span>
        </div>
      </div>

      {/* Middle: Subtle Invariant Tag */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1115] border border-[#23272F] text-[#9CA3AF] text-xs font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
        <span>Sales &le; 100 Stock</span>
        <span className="w-1 h-1 rounded-full bg-[#10B981]" />
      </div>

      {/* Right: Actions (Search ⌘K, Run Simulation, Presentation Mode) */}
      <div className="flex items-center gap-2">
        {/* Typography Clean Font Switcher */}
        <TypographySelector />

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#0F1115] border border-[#23272F] hover:border-[#323846] text-xs text-[#9CA3AF] hover:text-[#F5F7FA] transition-all shadow-sm"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="hidden sm:inline font-sans">Search</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-[#13161B] border border-[#23272F] text-[10px] text-[#9CA3AF] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Run Simulation CTA */}
        <button
          onClick={() => onNavigate('simulation')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#13161B] hover:bg-[#181C22] border border-[#23272F] text-xs font-mono font-semibold text-[#F5F7FA] transition-all"
        >
          <Play className="w-3 h-3 fill-[#10B981] text-[#10B981]" />
          <span className="hidden sm:inline">Simulation</span>
        </button>

        {/* Presentation Mode CTA */}
        <button
          onClick={() => onNavigate('presentation')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] text-xs font-mono font-bold text-white transition-all shadow-sm"
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          <span>Pitch Mode</span>
        </button>
      </div>
    </header>
  );
};
