import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#14b8a6", "#f97316"];

export function PricingParametersTab() {
  const [formData, setFormData] = useState({
    rentCost: 0,
    employeeCount: 0,
    averageSalary: 0,
    utilitiesCost: 0,
    insuranceCost: 0,
    maintenanceCost: 0,
    marketingCost: 0,
    materialsCost: 0,
    softwareLicenses: 0,
    otherCosts: 0,
    desiredProfitMargin: 30,
    cardTaxPercentage: 0,
    taxPercentage: 0,
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8,
  });

  const { data: settings } = trpc.services.getPricingSettings.useQuery();
  const saveMutation = trpc.services.savePricingSettings.useMutation();

  useEffect(() => {
    if (settings) {
      setFormData({
        rentCost: parseFloat(settings.rentCost?.toString() || "0"),
        employeeCount: settings.employeeCount || 0,
        averageSalary: parseFloat(settings.averageSalary?.toString() || "0"),
        utilitiesCost: parseFloat(settings.utilitiesCost?.toString() || "0"),
        insuranceCost: parseFloat(settings.insuranceCost?.toString() || "0"),
        maintenanceCost: parseFloat(settings.maintenanceCost?.toString() || "0"),
        marketingCost: parseFloat(settings.marketingCost?.toString() || "0"),
        materialsCost: parseFloat(settings.materialsCost?.toString() || "0"),
        softwareLicenses: parseFloat(settings.softwareLicenses?.toString() || "0"),
        otherCosts: parseFloat(settings.otherCosts?.toString() || "0"),
        desiredProfitMargin: parseFloat(settings.desiredProfitMargin?.toString() || "30"),
        cardTaxPercentage: parseFloat(settings.cardTaxPercentage?.toString() || "0"),
        taxPercentage: parseFloat(settings.taxPercentage?.toString() || "0"),
        workingDaysPerMonth: settings.workingDaysPerMonth || 22,
        workingHoursPerDay: parseFloat(settings.workingHoursPerDay?.toString() || "8"),
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(parseFloat(value)) ? 0 : parseFloat(value),
    }));
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync(formData);
  };

  // Calcular dados para gráfico
  const chartData = [
    { name: "Aluguel", value: formData.rentCost },
    { name: "Salários", value: formData.employeeCount * formData.averageSalary },
    { name: "Utilidades", value: formData.utilitiesCost },
    { name: "Seguros", value: formData.insuranceCost },
    { name: "Manutenção", value: formData.maintenanceCost },
    { name: "Marketing", value: formData.marketingCost },
    { name: "Materiais", value: formData.materialsCost },
    { name: "Software", value: formData.softwareLicenses },
    { name: "Outros", value: formData.otherCosts },
  ].filter((item) => item.value > 0);

  const totalCosts = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Custos Fixos Mensais</CardTitle>
            <CardDescription>Defina seus custos operacionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rentCost">Aluguel (R$)</Label>
                <Input
                  id="rentCost"
                  name="rentCost"
                  type="number"
                  value={formData.rentCost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="employeeCount">Funcionários</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="averageSalary">Salário Médio (R$)</Label>
                <Input
                  id="averageSalary"
                  name="averageSalary"
                  type="number"
                  value={formData.averageSalary}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="utilitiesCost">Utilidades (R$)</Label>
                <Input
                  id="utilitiesCost"
                  name="utilitiesCost"
                  type="number"
                  value={formData.utilitiesCost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="insuranceCost">Seguros (R$)</Label>
                <Input
                  id="insuranceCost"
                  name="insuranceCost"
                  type="number"
                  value={formData.insuranceCost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="maintenanceCost">Manutenção (R$)</Label>
                <Input
                  id="maintenanceCost"
                  name="maintenanceCost"
                  type="number"
                  value={formData.maintenanceCost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="marketingCost">Marketing (R$)</Label>
                <Input
                  id="marketingCost"
                  name="marketingCost"
                  type="number"
                  value={formData.marketingCost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="materialsCost">Materiais (R$)</Label>
                <Input
                  id="materialsCost"
                  name="materialsCost"
                  type="number"
                  value={formData.materialsCost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="softwareLicenses">Software (R$)</Label>
                <Input
                  id="softwareLicenses"
                  name="softwareLicenses"
                  type="number"
                  value={formData.softwareLicenses}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="otherCosts">Outros (R$)</Label>
                <Input
                  id="otherCosts"
                  name="otherCosts"
                  type="number"
                  value={formData.otherCosts}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Configurações de Precificação</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="desiredProfitMargin">Margem de Lucro Desejada (%)</Label>
                  <Input
                    id="desiredProfitMargin"
                    name="desiredProfitMargin"
                    type="number"
                    value={formData.desiredProfitMargin}
                    onChange={handleChange}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="cardTaxPercentage">Taxa de Cartão (%)</Label>
                  <Input
                    id="cardTaxPercentage"
                    name="cardTaxPercentage"
                    type="number"
                    value={formData.cardTaxPercentage}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="taxPercentage">Imposto (%)</Label>
                  <Input
                    id="taxPercentage"
                    name="taxPercentage"
                    type="number"
                    value={formData.taxPercentage}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="workingDaysPerMonth">Dias de Trabalho/Mês</Label>
                  <Input
                    id="workingDaysPerMonth"
                    name="workingDaysPerMonth"
                    type="number"
                    value={formData.workingDaysPerMonth}
                    onChange={handleChange}
                    placeholder="22"
                  />
                </div>
                <div>
                  <Label htmlFor="workingHoursPerDay">Horas de Trabalho/Dia</Label>
                  <Input
                    id="workingHoursPerDay"
                    name="workingHoursPerDay"
                    type="number"
                    step="0.5"
                    value={formData.workingHoursPerDay}
                    onChange={handleChange}
                    placeholder="8"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Parâmetros
            </Button>
          </CardContent>
        </Card>

        {/* Gráfico */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
            <CardDescription>Total: R$ {totalCosts.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `R$ ${(value as number).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum custo adicionado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
