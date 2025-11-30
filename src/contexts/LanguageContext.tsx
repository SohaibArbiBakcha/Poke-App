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
    arabic: 'العربية',

    // Moves
    moves: 'Moves',
    levelUpMoves: 'Level Up',
    tmMoves: 'TM/HM',
    eggMoves: 'Egg Moves',
    tutorMoves: 'Tutor',
    evolutionChain: 'Evolution Chain',

    // Battle Simulator
    battleSimulator: 'Battle Simulator',
    selectBattleMode: 'Select Battle Mode',
    team1: 'Team 1',
    team2: 'Team 2',
    addPokemon: 'Add Pokémon',
    selectPokemon: 'Select Pokémon',
    level: 'Level',
    ivs: 'Individual Values (IVs)',
    maxAllIVs: 'Max All IVs (31)',
    back: 'Back',
    confirm: 'Confirm',
    next: 'Next: Select Moves',
    startBattle: 'Start Battle!',
    selectMove: 'Select Move',
    selectMoves: 'Select 1-4 Moves',
    availableMoves: 'Available Moves',
    selectedMoves: 'Selected Moves',
    executeTurn: 'Execute Turn',
    wins: 'Wins',
    newBattle: 'New Battle',
    battleLog: 'Battle Log'
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
    arabic: 'العربية',

    // Moves
    moves: 'Capacités',
    levelUpMoves: 'Niveau',
    tmMoves: 'CT/CS',
    eggMoves: 'Œuf',
    tutorMoves: 'Tuteur',
    evolutionChain: 'Chaîne d\'évolution',

    // Battle Simulator
    battleSimulator: 'Simulateur de Combat',
    selectBattleMode: 'Sélectionner le mode de combat',
    team1: 'Équipe 1',
    team2: 'Équipe 2',
    addPokemon: 'Ajouter un Pokémon',
    selectPokemon: 'Sélectionner un Pokémon',
    level: 'Niveau',
    ivs: 'Valeurs Individuelles (IV)',
    maxAllIVs: 'Maximiser tous les IV (31)',
    back: 'Retour',
    confirm: 'Confirmer',
    next: 'Suivant: Sélectionner les Capacités',
    startBattle: 'Commencer le Combat!',
    selectMove: 'Sélectionner une Capacité',
    selectMoves: 'Sélectionner 1-4 Capacités',
    availableMoves: 'Capacités Disponibles',
    selectedMoves: 'Capacités Sélectionnées',
    executeTurn: 'Exécuter le Tour',
    wins: 'Gagne',
    newBattle: 'Nouveau Combat',
    battleLog: 'Journal de Combat'
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
    arabic: 'العربية',

    // Moves
    moves: 'الحركات',
    levelUpMoves: 'بالمستوى',
    tmMoves: 'الآلات',
    eggMoves: 'البيض',
    tutorMoves: 'المعلم',
    evolutionChain: 'سلسلة التطور',

    // Battle Simulator
    battleSimulator: 'محاكي المعركة',
    selectBattleMode: 'اختر نمط المعركة',
    team1: 'الفريق 1',
    team2: 'الفريق 2',
    addPokemon: 'إضافة بوكيمون',
    selectPokemon: 'اختر بوكيمون',
    level: 'المستوى',
    ivs: 'القيم الفردية',
    maxAllIVs: 'تعظيم جميع القيم (31)',
    back: 'رجوع',
    confirm: 'تأكيد',
    next: 'التالي: اختر الحركات',
    startBattle: 'ابدأ المعركة!',
    selectMove: 'اختر الحركة',
    selectMoves: 'اختر 1-4 حركات',
    availableMoves: 'الحركات المتاحة',
    selectedMoves: 'الحركات المختارة',
    executeTurn: 'تنفيذ الدور',
    wins: 'يفوز',
    newBattle: 'معركة جديدة',
    battleLog: 'سجل المعركة'
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