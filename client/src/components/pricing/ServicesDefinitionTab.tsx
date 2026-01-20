import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export function ServicesDefinitionTab() {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    commissionPercentage: 0,
    productCost: 0,
    currentPrice: 0,
  });

  const { data: services, isLoading } = trpc.services.getAll.useQuery();
  const createMutation = trpc.services.create.useMutation();
  const deleteMutation = trpc.services.delete.useMutation();
  const utils = trpc.useUtils();

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      toast.error("Nome do serviço é obrigatório");
      return;
    }

    try {
      await createMutation.mutateAsync(newService);
      setNewService({
        name: "",
        description: "",
        commissionPercentage: 0,
        productCost: 0,
        currentPrice: 0,
      });
      await utils.services.getAll.invalidate();
      toast.success("Serviço adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar serviço");
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      await utils.services.getAll.invalidate();
      toast.success("Serviço removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover serviço");
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Novo Serviço */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Serviço</CardTitle>
          <CardDescription>Defina os serviços que sua empresa oferece</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Ex: Corte de cabelo"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Descrição breve"
              />
            </div>
            <div>
              <Label htmlFor="commission">Comissão (%)</Label>
              <Input
                id="commission"
                type="number"
                value={newService.commissionPercentage}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    commissionPercentage: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="productCost">Custo de Produto (R$)</Label>
              <Input
                id="productCost"
                type="number"
                value={newService.productCost}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    productCost: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="currentPrice">Preço Atual (R$)</Label>
              <Input
                id="currentPrice"
                type="number"
                value={newService.currentPrice}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    currentPrice: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <Button
            onClick={handleAddService}
            disabled={createMutation.isPending}
            className="w-full"
          >
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Serviço
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Cadastrados</CardTitle>
          <CardDescription>
            {services?.length || 0} serviço(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : services && services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Serviço</th>
                    <th className="text-left py-2 px-2">Comissão</th>
                    <th className="text-left py-2 px-2">Custo Produto</th>
                    <th className="text-left py-2 px-2">Preço Atual</th>
                    <th className="text-left py-2 px-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service: any) => (
                    <tr key={service.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          {service.description && (
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2">{service.commissionPercentage}%</td>
                      <td className="py-2 px-2">R$ {parseFloat(service.productCost || 0).toFixed(2)}</td>
                      <td className="py-2 px-2">R$ {parseFloat(service.currentPrice || 0).toFixed(2)}</td>
                      <td className="py-2 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum serviço cadastrado ainda. Comece adicionando um serviço acima.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
