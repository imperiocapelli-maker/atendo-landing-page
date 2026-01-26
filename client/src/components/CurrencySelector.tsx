import React from 'react';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';
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

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  const currentCurrency = CURRENCY_OPTIONS.find((opt) => opt.value === currency);

  return (
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
  );
}
