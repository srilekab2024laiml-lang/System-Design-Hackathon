import React from 'react';
import { MonitorPlay } from 'lucide-react';
import { PresentationDeck } from '../components/presentation/PresentationDeck';

interface PresentationPageProps {
  onNavigate: (pageId: string) => void;
}

export const PresentationPage: React.FC<PresentationPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Section 38 & 39: Pitch Mode</span>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Judge Presentation Slide Deck (10 Slides)
          </h1>
        </div>

        <button
          onClick={() => onNavigate('overview')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Slide Deck */}
      <PresentationDeck onExit={() => onNavigate('overview')} />
    </div>
  );
};
