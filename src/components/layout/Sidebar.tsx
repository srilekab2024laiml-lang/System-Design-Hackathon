import React from 'react';
import {
  LayoutDashboard,
  AlertOctagon,
  FileSpreadsheet,
  Network,
  Boxes,
  Clock,
  CreditCard,
  PackageCheck,
  Database,
  Code2,
  Cpu,
  Layers,
  Shield,
  Activity,
  Lock,
  TestTube2,
  Scale,
  FileText,
  HelpCircle,
  PlayCircle,
  MonitorPlay,
  X
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: any;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
}) => {
  const sections: NavSection[] = [
    {
      title: 'FOUNDATIONS',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'problem', label: 'The Problem', icon: AlertOctagon, badge: 'P0' },
        { id: 'requirements', label: 'Requirements', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'CORE ARCHITECTURE',
      items: [
        { id: 'architecture', label: 'Architecture Explorer', icon: Network, badge: 'Flow' },
        { id: 'inventory', label: 'Inventory Concurrency', icon: Boxes },
        { id: 'reservation', label: 'Reservation Engine', icon: Clock },
        { id: 'payment', label: 'Payment Reliability', icon: CreditCard },
        { id: 'order', label: 'Order Lifecycle', icon: PackageCheck },
      ],
    },
    {
      title: 'DATA & CONTRACTS',
      items: [
        { id: 'database', label: 'Database & Schemas', icon: Database },
        { id: 'apis', label: 'API Specifications', icon: Code2 },
        { id: 'outbox', label: 'Event Bus & Outbox', icon: Layers },
        { id: 'idempotency', label: 'Idempotency Keys', icon: Cpu },
      ],
    },
    {
      title: 'SYSTEM RESILIENCE',
      items: [
        { id: 'scalability', label: 'Scalability & Traffic', icon: Layers },
        { id: 'ratelimiting', label: 'Bot & Rate Limiting', icon: Shield },
        { id: 'reliability', label: 'Failure Matrix', icon: AlertOctagon },
        { id: 'observability', label: 'Telemetry UI', icon: Activity },
        { id: 'security', label: 'Layered Security', icon: Lock },
      ],
    },
    {
      title: 'DEFENSE & VERIFICATION',
      items: [
        { id: 'simulation', label: 'Live Simulation', icon: PlayCircle, badge: 'Live' },
        { id: 'testing', label: 'Testing Suite', icon: TestTube2 },
        { id: 'tradeoffs', label: 'Trade-offs Analysis', icon: Scale },
        { id: 'adrs', label: 'Decisions (ADRs)', icon: FileText },
        { id: 'juryqa', label: 'Jury Q&A Defense', icon: HelpCircle, badge: '16 Qs' },
        { id: 'presentation', label: 'Pitch Presentation', icon: MonitorPlay },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#08090B] border-r border-[#23272F] flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } no-print`}
      >
        {/* Top Brand / Close */}
        <div className="h-14 px-4 border-b border-[#23272F] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#0F1115] border border-[#23272F] text-[#F5F7FA] font-mono font-bold text-xs">
              ⚡
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-mono text-xs font-bold text-[#F5F7FA] tracking-wider truncate">
                SALESTORM
              </span>
            )}
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-[#9CA3AF] hover:text-[#F5F7FA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5 pt-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      title={isCollapsed && !isMobileOpen ? item.label : undefined}
                      className={`w-full flex items-center rounded-[8px] text-xs font-medium transition-all group ${
                        isCollapsed && !isMobileOpen
                          ? 'justify-center p-2.5'
                          : 'justify-between px-3 py-2'
                      } ${
                        isActive
                          ? 'bg-[#0F1115] text-[#F5F7FA] border border-[#23272F] font-semibold'
                          : 'text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#0F1115]/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-indigo-400' : 'text-[#9CA3AF] group-hover:text-[#F5F7FA]'
                          }`}
                        />
                        {(!isCollapsed || isMobileOpen) && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>
                      {(!isCollapsed || isMobileOpen) && item.badge && (
                        <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#13161B] text-[#9CA3AF] border border-[#23272F] shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Status Badge */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3 border-t border-[#23272F] bg-[#0F1115]/50">
            <div className="rounded-[8px] border border-[#23272F] bg-[#08090B] p-2.5 text-[11px] font-mono space-y-1">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>INVENTORY:</span>
                <span className="text-[#F5F7FA] font-bold">100 UNITS</span>
              </div>
              <div className="flex items-center justify-between text-[#10B981]">
                <span>OVERSELL CAP:</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
