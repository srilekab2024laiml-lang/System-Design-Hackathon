import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontTheme = 'inter' | 'geist' | 'jakarta';

export interface FontOption {
  id: FontTheme;
  name: string;
  designer: string;
  sansFont: string;
  monoFont: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    designer: 'Rasmus Andersson',
    sansFont: 'Inter (Variable with Optical Sizing)',
    monoFont: 'JetBrains Mono',
    description: 'Precision engineering standard with balanced apertures, disambiguated glyphs, and tabular figures.',
  },
  {
    id: 'geist',
    name: 'Geist',
    designer: 'Vercel & Guillermo Rauch',
    sansFont: 'Geist Display & Text',
    monoFont: 'Geist Mono',
    description: 'Designed specifically for developer tools and high-density technical software architectures.',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    designer: 'Tokotype',
    sansFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    description: 'Refined geometric sans-serif engineered for modern enterprise systems and executive dashboards.',
  },
];

interface TypographyContextType {
  currentFont: FontTheme;
  setFont: (font: FontTheme) => void;
  fontOptions: FontOption[];
  activeOption: FontOption;
}

const TypographyContext = createContext<TypographyContextType | undefined>(undefined);

const STORAGE_KEY = 'salestorm_font_theme';

export const TypographyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFont, setCurrentFont] = useState<FontTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as FontTheme;
      if (saved && ['inter', 'geist', 'jakarta'].includes(saved)) {
        return saved;
      }
    }
    return 'inter';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-theme-inter', 'font-theme-geist', 'font-theme-jakarta');
    root.classList.add(`font-theme-${currentFont}`);
    localStorage.setItem(STORAGE_KEY, currentFont);
  }, [currentFont]);

  const activeOption = FONT_OPTIONS.find((f) => f.id === currentFont) || FONT_OPTIONS[0];

  return (
    <TypographyContext.Provider
      value={{
        currentFont,
        setFont: setCurrentFont,
        fontOptions: FONT_OPTIONS,
        activeOption,
      }}
    >
      {children}
    </TypographyContext.Provider>
  );
};

export const useTypography = (): TypographyContextType => {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error('useTypography must be used within a TypographyProvider');
  }
  return context;
};
