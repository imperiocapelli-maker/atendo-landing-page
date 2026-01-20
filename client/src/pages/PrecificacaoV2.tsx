import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, LogOut, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

type TabType = "parametros" | "como-atualizar" | "dashboard";

export default function PrecificacaoV2() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("parametros");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
      toast.error("Você precisa estar autenticado para acessar esta página");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Queries and mutations
  const { data: pricingSettings, isLoading: loadingSettings } = trpc.services.getPricingSettings.useQuery();
  const { data: services, isLoading: loadingServices } = trpc.services.getAll.useQuery();

  const savePricingMutation = trpc.services.savePricingSettings.useMutation({
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    },
  });

  const createServiceMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Serviço adicionado com sucesso!");
      setNewService({ name: "", commissionPercentage: 0, productCost: 0, currentPrice: 0 });
      trpc.useUtils().services.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar serviço: ${error.message}`);
    },
  });

  const deleteServiceMutation = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Serviço removido com sucesso!");
      trpc.useUtils().services.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao remover serviço: ${error.message}`);
    },
  });

  // Local state
  const [formData, setFormData] = useState({
    desiredProfitMargin: 0,
    marketingCost: 0,
    cardTaxPercentage: 0,
    taxPercentage: 0,
    rentCost: 0,
    employeeCount: 0,
    averageSalary: 0,
    utilitiesCost: 0,
    insuranceCost: 0,
    maintenanceCost: 0,
    materialsCost: 0,
    softwareLicenses: 0,
    otherCosts: 0,
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8,
    currency: "BRL",
  });

  const [newService, setNewService] = useState({
    name: "",
    commissionPercentage: 0,
    productCost: 0,
    currentPrice: 0,
  });

  // Load pricing settings into form
  useEffect(() => {
    if (pricingSettings) {
      setFormData({
        desiredProfitMargin: Number(pricingSettings.desiredProfitMargin) || 0,
        marketingCost: Number(pricingSettings.marketingCost) || 0,
        cardTaxPercentage: Number(pricingSettings.cardTaxPercentage) || 0,
        taxPercentage: Number(pricingSettings.taxPercentage) || 0,
        rentCost: Number(pricingSettings.rentCost) || 0,
        employeeCount: Number(pricingSettings.employeeCount) || 0,
        averageSalary: Number(pricingSettings.averageSalary) || 0,
        utilitiesCost: Number(pricingSettings.utilitiesCost) || 0,
        insuranceCost: Number(pricingSettings.insuranceCost) || 0,
        maintenanceCost: Number(pricingSettings.maintenanceCost) || 0,
        materialsCost: Number(pricingSettings.materialsCost) || 0,
        softwareLicenses: Number(pricingSettings.softwareLicenses) || 0,
        otherCosts: Number(pricingSettings.otherCosts) || 0,
        workingDaysPerMonth: Number(pricingSettings.workingDaysPerMonth) || 22,
        workingHoursPerDay: Number(pricingSettings.workingHoursPerDay) || 8,
        currency: pricingSettings.currency || "BRL",
      });
    }
  }, [pricingSettings]);

  const handleSaveSettings = () => {
    savePricingMutation.mutate(formData);
  };

  const handleAddService = () => {
    if (!newService.name.trim()) {
      toast.error("Nome do serviço é obrigatório");
      return;
    }
    createServiceMutation.mutate(newService);
  };

  const handleDeleteService = (id: number) => {
    deleteServiceMutation.mutate({ id });
  };

  // Calculate financial data for charts
  const calculateFinancialData = () => {
    const totalCosts = 
      (formData.rentCost || 0) +
      ((formData.employeeCount || 0) * (formData.averageSalary || 0)) +
      (formData.utilitiesCost || 0) +
      (formData.insuranceCost || 0) +
      (formData.maintenanceCost || 0) +
      (formData.materialsCost || 0) +
      (formData.softwareLicenses || 0) +
      (formData.otherCosts || 0);

    return [
      { name: "Lucro Desejado", value: formData.desiredProfitMargin || 0, color: "#22c55e" },
      { name: "Marketing", value: formData.marketingCost || 0, color: "#f59e0b" },
      { name: "Taxa de Cartão", value: formData.cardTaxPercentage || 0, color: "#fbbf24" },
      { name: "Imposto", value: formData.taxPercentage || 0, color: "#f87171" },
      { name: "Custos Fixos", value: (totalCosts / 100) || 0, color: "#ef4444" },
    ];
  };

  // Calculate service pricing
  const calculateServicePrice = (service: any) => {
    const basePrice = service.currentPrice || 0;
    const commission = (basePrice * (service.commissionPercentage || 0)) / 100;
    const productCost = service.productCost || 0;
    const suggestedPrice = basePrice + commission + productCost;
    const profit = suggestedPrice - basePrice - productCost;
    const profitPercent = basePrice > 0 ? (profit / basePrice) * 100 : 0;

    return {
      commission,
      suggestedPrice,
      profit,
      profitPercent,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const financialData = calculateFinancialData();
  const COLORS = ["#22c55e", "#f59e0b", "#fbbf24", "#f87171", "#ef4444"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard de Preço 2026</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, {user?.name}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 flex gap-4">
            <button
              onClick={() => setActiveTab("parametros")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "parametros"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Parâmetros
            </button>
            <button
              onClick={() => setActiveTab("como-atualizar")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "como-atualizar"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Como Atualizar
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "dashboard"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard de Preço
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* TAB: Parâmetros */}
        {activeTab === "parametros" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-black text-white">
                <CardTitle>Parâmetros de Custo</CardTitle>
                <CardDescription className="text-gray-300">
                  Saiba do detalhe negócio (ajuste)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingSettings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Financial Data Table */}
                    <div className="lg:col-span-2">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground bg-yellow-300 p-3 rounded">
                          Definição de Custos
                        </h3>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Lucro Desejado (%)
                              </label>
                              <Input
                                type="number"
                                value={formData.desiredProfitMargin}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    desiredProfitMargin: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Marketing (%)
                              </label>
                              <Input
                                type="number"
                                value={formData.marketingCost}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    marketingCost: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Taxa de Cartão (%)
                              </label>
                              <Input
                                type="number"
                                value={formData.cardTaxPercentage}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    cardTaxPercentage: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Imposto (%)
                              </label>
                              <Input
                                type="number"
                                value={formData.taxPercentage}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    taxPercentage: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Aluguel (R$)
                              </label>
                              <Input
                                type="number"
                                value={formData.rentCost}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    rentCost: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Funcionários
                              </label>
                              <Input
                                type="number"
                                value={formData.employeeCount}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    employeeCount: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Salário Médio (R$)
                              </label>
                              <Input
                                type="number"
                                value={formData.averageSalary}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    averageSalary: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Utilidades (R$)
                              </label>
                              <Input
                                type="number"
                                value={formData.utilitiesCost}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    utilitiesCost: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleSaveSettings}
                          disabled={savePricingMutation.isPending}
                          className="w-full mt-4"
                        >
                          {savePricingMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar Configurações"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Right: Chart */}
                    <div>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={financialData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {financialData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB: Como Atualizar */}
        {activeTab === "como-atualizar" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-yellow-300">
                <CardTitle>Definição de Serviços, Comissões e Custos de Produto</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingServices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Services Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="px-4 py-2 text-left">Serviços</th>
                            <th className="px-4 py-2 text-center">Comissão</th>
                            <th className="px-4 py-2 text-center">Custo de Produto</th>
                            <th className="px-4 py-2 text-center">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services && services.length > 0 ? (
                            services.map((service, index) => (
                              <tr
                                key={service.id}
                                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                              >
                                <td className="px-4 py-2 font-medium">{service.name}</td>
                                <td className="px-4 py-2 text-center text-green-600 font-semibold">
                                  {service.commissionPercentage}%
                                </td>
                                <td className="px-4 py-2 text-center">
                                  R$ {(Number(service.productCost) || 0).toFixed(2)}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteService(service.id)}
                                    disabled={deleteServiceMutation.isPending}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">
                                Nenhum serviço adicionado
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Service Form */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-foreground mb-4">Adicionar Novo Serviço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                          placeholder="Nome do serviço"
                          value={newService.name}
                          onChange={(e) =>
                            setNewService({ ...newService, name: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Comissão (%)"
                          value={newService.commissionPercentage}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              commissionPercentage: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Custo de Produto (R$)"
                          value={newService.productCost}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              productCost: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                        <Button
                          onClick={handleAddService}
                          disabled={createServiceMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {createServiceMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB: Dashboard de Preço */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-blue-900 text-white">
                <CardTitle>Dashboard de Preço 2026</CardTitle>
                <CardDescription className="text-gray-300">
                  Saiba do detalhe negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingServices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Services Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="px-3 py-2 text-left">Serviços</th>
                            <th className="px-3 py-2 text-center">Preço Atual</th>
                            <th className="px-3 py-2 text-center">Comissão</th>
                            <th className="px-3 py-2 text-center">Valor Comissão</th>
                            <th className="px-3 py-2 text-center">Custo de Produto</th>
                            <th className="px-3 py-2 text-center">Preço Sujerido</th>
                            <th className="px-3 py-2 text-center">Lucro Financeiro</th>
                            <th className="px-3 py-2 text-center">Lucro %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services && services.length > 0 ? (
                            services.map((service, index) => {
                              const calc = calculateServicePrice(service);
                              const profitColor =
                                calc.profitPercent >= 10
                                  ? "bg-green-200"
                                  : calc.profitPercent >= 5
                                  ? "bg-yellow-200"
                                  : "bg-red-200";

                              return (
                                <tr
                                  key={service.id}
                                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                >
                                  <td className="px-3 py-2 font-medium">{service.name}</td>
                                  <td className="px-3 py-2 text-center bg-orange-100">
                                    R$ {(Number(service.currentPrice) || 0).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {service.commissionPercentage}%
                                  </td>
                                  <td className="px-3 py-2 text-center bg-green-100">
                                    R$ {(Number(calc.commission) || 0).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-center bg-blue-100">
                                    R$ {(Number(service.productCost) || 0).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-center bg-blue-100">
                                    R$ {(Number(calc.suggestedPrice) || 0).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-center bg-blue-100">
                                    R$ {calc.profit.toFixed(2)}
                                  </td>
                                  <td className={`px-3 py-2 text-center font-semibold ${profitColor}`}>
                                    {calc.profitPercent.toFixed(2)}%
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">
                                Nenhum serviço adicionado
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Stats */}
                    {services && services.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="bg-blue-50 p-4 rounded">
                          <p className="text-xs text-muted-foreground">Total de Serviços</p>
                          <p className="text-lg font-bold text-blue-900">{services.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded">
                          <p className="text-xs text-muted-foreground">Preço Médio</p>
                          <p className="text-lg font-bold text-green-900">
                            R$ {(services.reduce((sum, s) => sum + (Number(s.currentPrice) || 0), 0) / services.length).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded">
                          <p className="text-xs text-muted-foreground">Lucro Médio %</p>
                          <p className="text-lg font-bold text-yellow-900">
                            {(
                              services.reduce((sum, s) => {
                                const calc = calculateServicePrice(s);
                                return sum + (isNaN(calc.profitPercent) ? 0 : calc.profitPercent);
                              }, 0) / (services.length || 1)
                            ).toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded">
                          <p className="text-xs text-muted-foreground">Receita Total</p>
                          <p className="text-lg font-bold text-orange-900">
                            R$ {services.reduce((sum, s) => sum + (Number(s.currentPrice) || 0), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
