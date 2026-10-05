import React, { useState, useRef, useEffect } from 'react';
import { Type, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useTypography, FontTheme } from '../../context/TypographyContext';

export const TypographySelector: React.FC = () => {
  const { currentFont, setFont, fontOptions, activeOption } = useTypography();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-[#0F1115] border border-[#23272F] hover:border-[#323846] text-xs text-[#9CA3AF] hover:text-[#F5F7FA] transition-all shadow-sm"
        title="Change clean font family"
        aria-label="Change typography font family"
        aria-expanded={isOpen}
      >
        <Type className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="font-sans font-medium hidden sm:inline text-[#F5F7FA]">
          {activeOption.name}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#9CA3AF] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-[12px] bg-[#0F1115] border border-[#23272F] shadow-2xl p-2.5 z-50 animate-fade-in no-print">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#23272F]/70 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#9CA3AF]">
                CLEAN TYPOGRAPHY SYSTEM
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              Antialiased
            </span>
          </div>

          {/* Options */}
          <div className="space-y-1">
            {fontOptions.map((option) => {
              const isSelected = option.id === currentFont;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setFont(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-[8px] transition-all border ${
                    isSelected
                      ? 'bg-[#13161B] border-indigo-500/50 shadow-sm'
                      : 'border-transparent hover:bg-[#181C22] hover:border-[#23272F]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold tracking-tight ${
                          isSelected ? 'text-[#F5F7FA]' : 'text-[#D1D5DB]'
                        }`}
                        style={{
                          fontFamily:
                            option.id === 'inter'
                              ? 'Inter, sans-serif'
                              : option.id === 'geist'
                              ? 'Geist, sans-serif'
                              : 'Plus Jakarta Sans, sans-serif',
                        }}
                      >
                        {option.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B7280]">
                        {option.id === 'inter' ? 'Linear/Stripe' : option.id === 'geist' ? 'Vercel UI' : 'Product'}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-[#23272F]/50 flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                    <span>Mono: {option.monoFont}</span>
                    <span className="text-emerald-400">Optical Sizing ✓</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Typography Features Footer */}
          <div className="mt-2 pt-2 border-t border-[#23272F] px-2 flex items-center justify-between text-[9px] font-mono text-[#6B7280]">
            <span>Tabular Numbers (tnum)</span>
            <span>Disambiguated 0/O/1/l</span>
          </div>
        </div>
      )}
    </div>
  );
};
