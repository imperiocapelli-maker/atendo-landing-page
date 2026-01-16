import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Users, CheckCircle, AlertCircle, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LeadsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Queries
  const { data: leadsData, isLoading: leadsLoading } = trpc.leads.listLeads.useQuery();
  const { data: statsData, isLoading: statsLoading } = trpc.leads.getStats.useQuery();
  const updateStatusMutation = trpc.leads.updateLeadStatus.useMutation();

  // Verificar autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-8">Você precisa estar autenticado para acessar o dashboard de leads.</p>
          <Button className="bg-primary hover:bg-primary/90">Fazer Login</Button>
        </div>
      </div>
    );
  }

  // Verificar se é admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Apenas administradores podem acessar este dashboard.</p>
        </div>
      </div>
    );
  }

  const stats: {
    total: number;
    new: number;
    contacted: number;
    interested: number;
    converted: number;
    rejected: number;
    webhookPending: number;
    webhookFailed: number;
    byCountry: { br: number; ar: number; py: number };
  } = (statsData?.stats as any) || {
    total: 0,
    new: 0,
    contacted: 0,
    interested: 0,
    converted: 0,
    rejected: 0,
    webhookPending: 0,
    webhookFailed: 0,
    byCountry: { br: 0, ar: 0, py: 0 },
  };
  const leads = leadsData?.leads || [];
  const filteredLeads = selectedStatus ? leads.filter((l) => l.status === selectedStatus) : leads;

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    interested: "bg-purple-100 text-purple-800",
    converted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    new: "Novo",
    contacted: "Contatado",
    interested: "Interessado",
    converted: "Convertido",
    rejected: "Rejeitado",
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateStatusMutation.mutate(
      { leadId, status: newStatus as any },
      {
        onSuccess: () => {
          // Recarregar dados
          window.location.reload();
        },
      }
    );
  };

  const downloadCSV = () => {
    if (!leads.length) return;

    const headers = ["Telefone", "País", "Idioma", "Status", "Webhook", "Data"];
    const rows = leads.map((lead) => [
      lead.formattedPhone,
      lead.country.toUpperCase(),
      lead.language,
      statusLabels[lead.status] || lead.status,
      lead.zapierWebhookSent,
      format(new Date(lead.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Leads</h1>
          <p className="text-gray-600">Gerencie e acompanhe todos os leads capturados</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total de Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-600">Novos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-700">{stats.new}</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-600">Contatados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-700">{stats.contacted}</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-600">Interessados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-700">{stats.interested}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-600">Convertidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700">{stats.converted}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="mb-6 flex gap-4 flex-wrap items-center">
          <Button
            onClick={() => setSelectedStatus(null)}
            variant={selectedStatus === null ? "default" : "outline"}
            className="rounded-full"
          >
            Todos ({stats.total})
          </Button>
          <Button
            onClick={() => setSelectedStatus("new")}
            variant={selectedStatus === "new" ? "default" : "outline"}
            className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            Novos ({stats.new})
          </Button>
          <Button
            onClick={() => setSelectedStatus("contacted")}
            variant={selectedStatus === "contacted" ? "default" : "outline"}
            className="rounded-full bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          >
            Contatados ({stats.contacted})
          </Button>
          <Button
            onClick={() => setSelectedStatus("interested")}
            variant={selectedStatus === "interested" ? "default" : "outline"}
            className="rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100"
          >
            Interessados ({stats.interested})
          </Button>
          <Button
            onClick={() => setSelectedStatus("converted")}
            variant={selectedStatus === "converted" ? "default" : "outline"}
            className="rounded-full bg-green-50 text-green-700 hover:bg-green-100"
          >
            Convertidos ({stats.converted})
          </Button>

          <div className="ml-auto">
            <Button onClick={downloadCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Leads Table */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle>
              {selectedStatus ? `Leads - ${statusLabels[selectedStatus]}` : "Todos os Leads"}
            </CardTitle>
            <CardDescription>{filteredLeads.length} registros</CardDescription>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : filteredLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">País</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Webhook</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <a
                            href={`https://wa.me/${lead.formattedPhone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {lead.formattedPhone}
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{lead.country.toUpperCase()}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={statusColors[lead.status] || "bg-gray-100 text-gray-800"}>
                            {statusLabels[lead.status] || lead.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {lead.zapierWebhookSent === "sent" ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Enviado
                            </div>
                          ) : lead.zapierWebhookSent === "failed" ? (
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              Falhou
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50">
                              Pendente
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {format(new Date(lead.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="interested">Interessado</option>
                            <option value="converted">Convertido</option>
                            <option value="rejected">Rejeitado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum lead encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
