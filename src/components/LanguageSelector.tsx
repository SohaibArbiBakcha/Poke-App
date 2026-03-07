import React, { useState, useEffect, useRef } from 'react';
import { Languages } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'fr', name: t('french'), flag: '🇫🇷' },
    { code: 'ar', name: t('arabic'), flag: '🇸🇦' }
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <Languages size={20} />
        <span className="hidden sm:inline">{t('language')}</span>
        <span className="text-lg">{languages.find(l => l.code === language)?.flag}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                language === lang.code ? 'bg-red-50 text-red-600' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
