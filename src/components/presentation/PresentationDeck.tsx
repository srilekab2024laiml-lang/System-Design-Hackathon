import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  X,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Printer
} from 'lucide-react';
import { presentationSlides } from '../../data/presentationData';
import { TypographySelector } from '../layout/TypographySelector';

interface PresentationDeckProps {
  onExit?: () => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({ onExit }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const slide = presentationSlides[currentSlideIndex];
  const totalSlides = presentationSlides.length;

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, isFullscreen]);

  return (
    <div className={`flex flex-col bg-[#050811] text-white min-h-[85vh] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none min-h-screen' : ''
    }`}>
      {/* Presentation Top Bar */}
      <div className="h-14 border-b border-slate-800 bg-[#090d16] px-6 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-bold text-slate-950 text-xs">
            ⚡
          </div>
          <span className="font-mono text-xs font-bold text-slate-300">
            SALESTORM JURY PITCH DECK
          </span>
          <span className="text-[#323846]">|</span>
          <span className="font-mono text-xs font-bold text-indigo-400">
            {String(currentSlideIndex + 1).padStart(2, '0')} / {totalSlides}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <TypographySelector />

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              showNotes ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Speaker Notes</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            title="Print Presentation"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Exit Presentation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-12 max-w-6xl mx-auto w-full select-none">
        {/* Slide Header */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              0{slide.id} / 10
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {slide.subtitle}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-sans text-white tracking-tight">
            {slide.title}
          </h1>
          <p className="text-base sm:text-lg text-cyan-300 font-mono font-medium">
            &rarr; {slide.takeaway}
          </p>
        </div>

        {/* Slide Bullets */}
        <div className="space-y-4 mb-8">
          {slide.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        {/* Code / Diagram Snippet if present */}
        {slide.codeOrDiagram && (
          <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 whitespace-pre leading-relaxed overflow-x-auto shadow-inner">
            {slide.codeOrDiagram}
          </div>
        )}

        {/* Big Metrics if present */}
        {slide.metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 font-mono">
            {slide.metrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                <span className="text-[11px] uppercase text-slate-400 font-semibold">{m.label}</span>
                <div className="text-2xl sm:text-3xl font-bold text-white mt-1">{m.value}</div>
                {m.hint && <span className="text-[10px] text-cyan-400">{m.hint}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Speaker Notes Drawer (Bottom Sheet) */}
      {showNotes && (
        <div className="border-t border-slate-800 bg-[#070b14] p-6 max-h-48 overflow-y-auto animate-fade-in no-print">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Presenter Speaking Notes (Internal)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {slide.speakerNotes}
            </p>
          </div>
        </div>
      )}

      {/* Slide Navigation Footer */}
      <div className="h-16 border-t border-slate-800 bg-[#090d16] px-6 flex items-center justify-between no-print">
        {/* Left: Quick slide dots */}
        <div className="flex items-center gap-1.5">
          {presentationSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlideIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Middle Keyboard Hint */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span>Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">&larr;</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">&rarr;</kbd> to navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">F</kbd> Fullscreen</span>
        </div>

        {/* Right: Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-mono font-bold text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-xs font-mono font-bold text-white transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
