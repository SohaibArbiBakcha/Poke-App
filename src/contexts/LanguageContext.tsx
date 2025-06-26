import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    pokemonLogo: 'Pokémon',
    backToPokedex: 'Back to Pokédex',
    
    // Search and Filters
    searchPlaceholder: 'Search Pokémon...',
    generation: 'Generation',
    types: 'Types',
    
    // Pokemon Details
    height: 'Height',
    weight: 'Weight',
    abilities: 'Abilities',
    baseStats: 'Base Stats',
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    specialAttack: 'Special Attack',
    specialDefense: 'Special Defense',
    speed: 'Speed',
    
    // Loading and Errors
    loading: 'Loading...',
    pokemonNotFound: 'Pokémon not found',
    
    // Language selector
    language: 'Language',
    english: 'English',
    french: 'Français',
    arabic: 'العربية'
  },
  fr: {
    // Header
    pokemonLogo: 'Pokémon',
    backToPokedex: 'Retour au Pokédex',
    
    // Search and Filters
    searchPlaceholder: 'Rechercher un Pokémon...',
    generation: 'Génération',
    types: 'Types',
    
    // Pokemon Details
    height: 'Taille',
    weight: 'Poids',
    abilities: 'Capacités',
    baseStats: 'Statistiques de Base',
    hp: 'PV',
    attack: 'Attaque',
    defense: 'Défense',
    specialAttack: 'Attaque Spéciale',
    specialDefense: 'Défense Spéciale',
    speed: 'Vitesse',
    
    // Loading and Errors
    loading: 'Chargement...',
    pokemonNotFound: 'Pokémon introuvable',
    
    // Language selector
    language: 'Langue',
    english: 'English',
    french: 'Français',
    arabic: 'العربية'
  },
  ar: {
    // Header
    pokemonLogo: 'بوكيمون',
    backToPokedex: 'العودة إلى البوكيديكس',
    
    // Search and Filters
    searchPlaceholder: 'البحث عن بوكيمون...',
    generation: 'الجيل',
    types: 'الأنواع',
    
    // Pokemon Details
    height: 'الطول',
    weight: 'الوزن',
    abilities: 'القدرات',
    baseStats: 'الإحصائيات الأساسية',
    hp: 'نقاط الحياة',
    attack: 'الهجوم',
    defense: 'الدفاع',
    specialAttack: 'الهجوم الخاص',
    specialDefense: 'الدفاع الخاص',
    speed: 'السرعة',
    
    // Loading and Errors
    loading: 'جاري التحميل...',
    pokemonNotFound: 'لم يتم العثور على البوكيمون',
    
    // Language selector
    language: 'اللغة',
    english: 'English',
    french: 'Français',
    arabic: 'العربية'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};