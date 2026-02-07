import { LANGUAGES, type SupportedLanguage } from '../types';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  selected: SupportedLanguage | null;
  onSelect: (lang: SupportedLanguage) => void;
}

export default function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const languages = Object.entries(LANGUAGES) as [SupportedLanguage, typeof LANGUAGES[SupportedLanguage]][];

  return (
    <div className="grid grid-cols-2 gap-3">
      {languages.map(([key, { label, native, flag }]) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98] ${
              isSelected
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{flag}</span>
            <div>
              <div className="text-sm font-semibold text-gray-900">{label}</div>
              <div className="text-xs text-gray-500">{native}</div>
            </div>
            {isSelected && (
              <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}
