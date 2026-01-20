import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Plus, Trash2 } from "lucide-react";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"];

interface FinancialData {
  label: string;
  percentage: number;
  color: string;
}

interface Service {
  id: string;
  name: string;
  commission: number;
  productCost: number;
}

interface PricingData {
  serviceName: string;
  currentPrice: number;
  commission: number;
  commissionValue: number;
  productCost: number;
  suggestedPrice: number;
  profit: number;
  profitPercentage: number;
}

export default function PricingDashboard() {
  const [activeTab, setActiveTab] = useState("parametros");
  
  // Parâmetros
  const [desiredProfit, setDesiredProfit] = useState(10);
  const [marketing, setMarketing] = useState(2);
  const [cardFee, setCardFee] = useState(4);
  const [taxes, setTaxes] = useState(4.8);
  const [fixedCosts, setFixedCosts] = useState(36.45);

  // Serviços
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "BABY LISS", commission: 30, productCost: 7 },
    { id: "2", name: "BARBA", commission: 40, productCost: 2 },
    { id: "3", name: "BARBA MAQUINA", commission: 40, productCost: 1 },
  ]);

  const [pricingData, setPricingData] = useState<PricingData[]>([
    {
      serviceName: "BABY LISS",
      currentPrice: 45,
      commission: 30,
      commissionValue: 13.5,
      productCost: 7,
      suggestedPrice: 50.91,
      profit: 3.69,
      profitPercentage: 8.19,
    },
    {
      serviceName: "BARBA",
      currentPrice: 40,
      commission: 40,
      commissionValue: 16,
      productCost: 2,
      suggestedPrice: 53.33,
      profit: 3.5,
      profitPercentage: 8.75,
    },
  ]);

  const [newService, setNewService] = useState({ name: "", commission: 0, productCost: 0 });

  // Calcular dados financeiros
  const financialData: FinancialData[] = [
    { label: "Lucro Desejado", percentage: desiredProfit, color: "#10b981" },
    { label: "Marketing", percentage: marketing, color: "#f59e0b" },
    { label: "Taxa de Cartão Média", percentage: cardFee, color: "#fbbf24" },
    { label: "Imposto", percentage: taxes, color: "#fca5a5" },
    { label: "Custo Fixo + Investimento", percentage: fixedCosts, color: "#ef4444" },
  ];

  const totalPercentage = financialData.reduce((sum, item) => sum + item.percentage, 0);

  const chartData = financialData.map((item) => ({
    name: item.label,
    value: item.percentage,
  }));

  const addService = () => {
    if (newService.name) {
      setServices([
        ...services,
        {
          id: Date.now().toString(),
          name: newService.name,
          commission: newService.commission,
          productCost: newService.productCost,
        },
      ]);
      setNewService({ name: "", commission: 0, productCost: 0 });
    }
  };

  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const calculateSuggestedPrice = (productCost: number, commission: number) => {
    const commissionValue = (productCost * commission) / 100;
    const totalCost = productCost + commissionValue;
    const suggestedPrice = totalCost / (1 - totalPercentage / 100);
    return suggestedPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Preço</h1>
          <p className="text-gray-600">Salão de Beleza Império capelli</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
            <TabsTrigger value="servicos">Como Atualizar</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard de Preço</TabsTrigger>
          </TabsList>

          {/* TAB 1: PARÂMETROS */}
          <TabsContent value="parametros" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Definição de Custos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Lucro Desejado (%)</Label>
                    <Input
                      type="number"
                      value={desiredProfit}
                      onChange={(e) => setDesiredProfit(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Marketing (%)</Label>
                    <Input
                      type="number"
                      value={marketing}
                      onChange={(e) => setMarketing(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Taxa de Cartão Média (%)</Label>
                    <Input
                      type="number"
                      value={cardFee}
                      onChange={(e) => setCardFee(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Imposto (%)</Label>
                    <Input
                      type="number"
                      value={taxes}
                      onChange={(e) => setTaxes(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Custo Fixo + Investimento (%)</Label>
                    <Input
                      type="number"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="bg-yellow-100 p-3 rounded mt-4">
                    <p className="font-semibold text-gray-900">
                      Total: {totalPercentage.toFixed(2)}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico Pizza */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Custos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${value.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${(value as number).toFixed(1)}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: COMO ATUALIZAR */}
          <TabsContent value="servicos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Definição de Serviços, Comissões e Custos de Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabela de Serviços */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="border p-2 text-left">Serviços</th>
                        <th className="border p-2 text-center">Comissão</th>
                        <th className="border p-2 text-center">Custo de Produto</th>
                        <th className="border p-2 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service, index) => (
                        <tr key={service.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                          <td className="border p-2">{service.name}</td>
                          <td className="border p-2 text-center">{service.commission}%</td>
                          <td className="border p-2 text-center">R$ {service.productCost.toFixed(2)}</td>
                          <td className="border p-2 text-center">
                            <button
                              onClick={() => deleteService(service.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Adicionar Novo Serviço */}
                <div className="bg-yellow-100 p-4 rounded space-y-3">
                  <h3 className="font-semibold text-gray-900">Adicionar Novo Serviço</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-sm">Nome do Serviço</Label>
                      <Input
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Ex: BABY LISS"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Comissão (%)</Label>
                      <Input
                        type="number"
                        value={newService.commission}
                        onChange={(e) =>
                          setNewService({ ...newService, commission: parseFloat(e.target.value) })
                        }
                        placeholder="30"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Custo Produto (R$)</Label>
                      <Input
                        type="number"
                        value={newService.productCost}
                        onChange={(e) =>
                          setNewService({ ...newService, productCost: parseFloat(e.target.value) })
                        }
                        placeholder="7"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button onClick={addService} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus size={16} className="mr-2" /> Adicionar Serviço
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: DASHBOARD DE PREÇO */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listado tudo, basta ir no Dashboard de Preço e definir o preço atual do serviço citado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="border p-2 text-left">Serviços</th>
                        <th className="border p-2 text-center">Preço Atual</th>
                        <th className="border p-2 text-center">Comissão</th>
                        <th className="border p-2 text-center">Valor Comissão</th>
                        <th className="border p-2 text-center">Custo de Produto</th>
                        <th className="border p-2 text-center">Preço Sugerido</th>
                        <th className="border p-2 text-center">Lucro Financeiro</th>
                        <th className="border p-2 text-center">Lucro %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-orange-50" : "bg-white"}>
                          <td className="border p-2 font-medium">{item.serviceName}</td>
                          <td className="border p-2 text-center">R$ {item.currentPrice.toFixed(2)}</td>
                          <td className="border p-2 text-center bg-green-100">{item.commission}%</td>
                          <td className="border p-2 text-center">R$ {item.commissionValue.toFixed(2)}</td>
                          <td className="border p-2 text-center">R$ {item.productCost.toFixed(2)}</td>
                          <td className="border p-2 text-center font-semibold">R$ {item.suggestedPrice.toFixed(2)}</td>
                          <td className="border p-2 text-center font-semibold">R$ {item.profit.toFixed(2)}</td>
                          <td className={`border p-2 text-center font-semibold ${
                            item.profitPercentage >= 10
                              ? "bg-yellow-200"
                              : item.profitPercentage >= 5
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}>
                            {item.profitPercentage.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
