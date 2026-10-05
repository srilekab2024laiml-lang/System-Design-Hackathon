import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandSearch } from '../search/CommandSearch';
import { ExportModal } from '../export/ExportModal';

interface LayoutProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activePage,
  onNavigate,
  children,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Global search event listener
  React.useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F7FA] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-[#F5F7FA]">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        <Header
          activePage={activePage}
          onNavigate={onNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1360px] w-full mx-auto animate-fade-in">
          {children}
        </main>

        {/* Minimal Footer (Section 55) */}
        <footer className="border-t border-[#23272F] bg-[#08090B] px-6 py-6 text-center text-xs font-mono text-[#9CA3AF] no-print">
          <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F5F7FA]">SALESTORM</span>
              <span className="text-[#323846]">&bull;</span>
              <span>High-Scale E-Commerce Flash Sale</span>
            </div>
            <div>System Design Hackathon</div>
            <div className="text-[11px] text-[#6B7280]">
              Architecture &bull; Reliability &bull; Scale &bull; Zero Oversell
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <CommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
