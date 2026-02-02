import React from 'react';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const CURRENCY_OPTIONS: { value: Currency; label: string; flag: string }[] = [
  { value: 'BRL', label: '🇧🇷 BRL', flag: '🇧🇷' },
  { value: 'USD', label: '🇺🇸 USD', flag: '🇺🇸' },
  { value: 'ARS', label: '🇦🇷 ARS', flag: '🇦🇷' },
  { value: 'PYG', label: '🇵🇾 PYG', flag: '🇵🇾' },
];

const LANGUAGE_OPTIONS: { value: 'pt' | 'es'; flag: string; country: string }[] = [
  { value: 'pt', flag: '🇧🇷', country: 'Brasil' },
  { value: 'es', flag: '🇦🇷', country: 'Argentina' },
  { value: 'es', flag: '🇵🇾', country: 'Paraguai' },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();

  const currentCurrency = CURRENCY_OPTIONS.find((opt) => opt.value === currency);

  const handleLanguageChange = (lang: 'pt' | 'es') => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language Selector - Only Flags */}
      <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full p-1 shadow-lg border border-border">
        {LANGUAGE_OPTIONS.map((option, index) => (
          <button
            key={`${option.flag}-${index}`}
            type="button"
            onClick={() => handleLanguageChange(option.value)}
            className={`text-xl px-3 py-2 rounded-full transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
              language === option.value && (option.flag === '🇧🇷' || (option.flag === '🇦🇷' && index === 1) || (option.flag === '🇵🇾'))
                ? 'bg-primary/20 scale-110'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={`${option.country} - ${option.value === 'pt' ? 'Português' : 'Español'}`}
          >
            {option.flag}
          </button>
        ))}
      </div>

      {/* Currency Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white hover:bg-gray-50"
            title="Selecionar moeda"
          >
            <Globe className="h-4 w-4" />
            <span>{currentCurrency?.label || 'BRL'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {CURRENCY_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setCurrency(option.value)}
              className={`cursor-pointer ${currency === option.value ? 'bg-blue-50' : ''}`}
            >
              <span className="mr-2">{option.flag}</span>
              <span>{option.label}</span>
              {currency === option.value && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
