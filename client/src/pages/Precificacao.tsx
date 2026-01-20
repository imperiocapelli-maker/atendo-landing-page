import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Precificacao() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

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
      // Refetch services
      trpc.useUtils().services.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar serviço: ${error.message}`);
    },
  });

  const deleteServiceMutation = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Serviço removido com sucesso!");
      // Refetch services
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Precificação</h1>
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
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Precificação</CardTitle>
                <CardDescription>
                  Defina os parâmetros para cálculo automático de preços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingSettings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Profit Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Lucro e Taxas</h3>
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
                            placeholder="Ex: 30"
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
                            placeholder="Ex: 10"
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
                            placeholder="Ex: 2.5"
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
                            placeholder="Ex: 15"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Costs Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Custos Fixos</h3>
                      <div className="grid grid-cols-2 gap-4">
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
                            placeholder="Ex: 1000"
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
                            placeholder="Ex: 2"
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
                            placeholder="Ex: 2000"
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
                            placeholder="Ex: 300"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Seguro (R$)
                          </label>
                          <Input
                            type="number"
                            value={formData.insuranceCost}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                insuranceCost: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="Ex: 200"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Manutenção (R$)
                          </label>
                          <Input
                            type="number"
                            value={formData.maintenanceCost}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                maintenanceCost: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="Ex: 150"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={handleSaveSettings}
                      disabled={savePricingMutation.isPending}
                      className="w-full"
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Services */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Meus Serviços</CardTitle>
                <CardDescription>
                  Gerencie seus serviços e preços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingServices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Services List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {services && services.length > 0 ? (
                        services.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">
                                {service.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Comissão: {service.commissionPercentage}%
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                              disabled={deleteServiceMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhum serviço adicionado
                        </p>
                      )}
                    </div>

                    {/* Add Service Form */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h4 className="font-medium text-foreground text-sm">
                        Adicionar Novo Serviço
                      </h4>
                      <Input
                        placeholder="Nome do serviço"
                        value={newService.name}
                        onChange={(e) =>
                          setNewService({ ...newService, name: e.target.value })
                        }
                        className="text-sm"
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
                        className="text-sm"
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
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Preço Atual (R$)"
                        value={newService.currentPrice}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            currentPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="text-sm"
                      />
                      <Button
                        onClick={handleAddService}
                        disabled={createServiceMutation.isPending}
                        className="w-full"
                        size="sm"
                      >
                        {createServiceMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Serviço
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
