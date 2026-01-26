import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentOption {
  id: string;
  label: string;
  description: string;
  price: number;
  stripePriceId: string;
  billingInterval: 'monthly' | 'yearly';
  installments?: number;
}

interface PaymentOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  monthlyPrice: number;
  monthlyStripePriceId: string;
  annualPrice: number;
  annualStripePriceId: string;
  installmentPrices: Array<{
    installments: number;
    price: number;
    stripePriceId: string;
  }>;
  onSelectPayment: (option: PaymentOption) => void;
  isLoading?: boolean;
}

export function PaymentOptionsModal({
  open,
  onOpenChange,
  planName,
  monthlyPrice,
  monthlyStripePriceId,
  annualPrice,
  annualStripePriceId,
  installmentPrices,
  onSelectPayment,
  isLoading = false,
}: PaymentOptionsModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('monthly');
  const { convertPrice, formatPrice } = useCurrency();

  // Mostrar opções de parcelamento apenas se Anual foi selecionado
  const showInstallments = selectedOption === 'annual';
  
  const paymentOptions: PaymentOption[] = [
    {
      id: 'monthly',
      label: 'Mensal',
      description: 'Renovação automática todo mês',
      price: monthlyPrice,
      stripePriceId: monthlyStripePriceId,
      billingInterval: 'monthly',
    },
    {
      id: 'annual',
      label: 'Anual',
      description: 'Pagamento único no ano',
      price: annualPrice,
      stripePriceId: annualStripePriceId,
      billingInterval: 'yearly',
    },
    ...(showInstallments ? installmentPrices.map((ip) => ({
      id: `installment_${ip.installments}x`,
      label: `${ip.installments}x sem juros`,
      description: `${ip.installments} parcelas de R$ ${(ip.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      price: ip.price,
      stripePriceId: ip.stripePriceId,
      billingInterval: 'yearly' as const,
      installments: ip.installments,
    })) : []),
  ];

  const handleContinue = () => {
    const selected = paymentOptions.find((opt) => opt.id === selectedOption);
    if (selected) {
      onSelectPayment(selected);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Escolha seu plano de pagamento</DialogTitle>
          <DialogDescription>
            Selecione como deseja pagar o plano {planName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {paymentOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer rounded-lg border border-border p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(convertPrice(option.price))}
                      </p>
                      {option.billingInterval === 'monthly' && (
                        <p className="text-xs text-muted-foreground">/mês</p>
                      )}
                      {option.billingInterval === 'yearly' && !option.installments && (
                        <p className="text-xs text-muted-foreground">/ano</p>
                      )}
                      {option.installments && (
                        <p className="text-xs text-muted-foreground">/parcela</p>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Resumo do total */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium">{planName}</span>
                </div>
                {selectedOption === 'monthly' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cobrança</span>
                    <span className="font-medium">Mensal (renovação automática)</span>
                  </div>
                )}
                {selectedOption === 'annual' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cobrança</span>
                    <span className="font-medium">Única (anual)</span>
                  </div>
                )}
                {selectedOption.startsWith('installment_') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cobrança</span>
                    <span className="font-medium">
                      {paymentOptions.find((opt) => opt.id === selectedOption)?.installments}x sem juros
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(convertPrice(paymentOptions.find((opt) => opt.id === selectedOption)?.price || 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
