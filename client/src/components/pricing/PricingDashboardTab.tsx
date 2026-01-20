import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PricingDashboardTab() {
  const { data: services, isLoading: servicesLoading } = trpc.services.getAll.useQuery();
  const { data: settings } = trpc.services.getPricingSettings.useQuery();

  const dashboardData = useMemo(() => {
    if (!services || !settings) return null;

    return services.map((service: any) => {
      const currentPrice = parseFloat(service.currentPrice || 0);
      const productCost = parseFloat(service.productCost || 0);
      const commissionPercentage = service.commissionPercentage || 0;
      const commissionValue = currentPrice * (commissionPercentage / 100);
      
      const totalCost = productCost + commissionValue;
      const profit = currentPrice - totalCost;
      const profitMargin = currentPrice > 0 ? (profit / currentPrice) * 100 : 0;

      return {
        id: service.id,
        name: service.name,
        currentPrice,
        productCost,
        commissionPercentage,
        commissionValue,
        totalCost,
        profit,
        profitMargin,
      };
    });
  }, [services, settings]);

  if (servicesLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!dashboardData || dashboardData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-2">Nenhum serviço cadastrado</p>
        <p className="text-sm">Vá para a aba "Serviços" para adicionar serviços</p>
      </div>
    );
  }

  const totalProfit = dashboardData.reduce((sum, s) => sum + s.profit, 0);
  const totalRevenue = dashboardData.reduce((sum, s) => sum + s.currentPrice, 0);
  const averageProfitMargin = dashboardData.length > 0
    ? dashboardData.reduce((sum, s) => sum + s.profitMargin, 0) / dashboardData.length
    : 0;

  const chartData = dashboardData.map((s) => ({
    name: s.name,
    "Preço Atual": s.currentPrice,
    "Custo Total": s.totalCost,
    "Lucro": s.profit,
  }));

  const profitMarginData = dashboardData.map((s) => ({
    name: s.name,
    "Margem %": s.profitMargin,
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.length} serviço(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              R$ {totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalProfit / totalRevenue) * 100).toFixed(1)}% da receita
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProfitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Entre seus serviços
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Preço vs Custo vs Lucro */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Preços e Custos</CardTitle>
            <CardDescription>Comparação por serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${(value as number).toFixed(2)}`} />
                <Legend />
                <Bar dataKey="Preço Atual" fill="#3b82f6" />
                <Bar dataKey="Custo Total" fill="#ef4444" />
                <Bar dataKey="Lucro" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Margem de Lucro */}
        <Card>
          <CardHeader>
            <CardTitle>Margem de Lucro por Serviço</CardTitle>
            <CardDescription>Percentual de lucro</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: any) => `${(value as number).toFixed(1)}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Margem %"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Serviços</CardTitle>
          <CardDescription>Análise completa de cada serviço</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Serviço</th>
                  <th className="text-right py-2 px-2">Preço Atual</th>
                  <th className="text-right py-2 px-2">Custo Produto</th>
                  <th className="text-right py-2 px-2">Comissão</th>
                  <th className="text-right py-2 px-2">Custo Total</th>
                  <th className="text-right py-2 px-2">Lucro</th>
                  <th className="text-right py-2 px-2">Margem %</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-medium">{service.name}</td>
                    <td className="text-right py-2 px-2">R$ {service.currentPrice.toFixed(2)}</td>
                    <td className="text-right py-2 px-2">R$ {service.productCost.toFixed(2)}</td>
                    <td className="text-right py-2 px-2">
                      R$ {service.commissionValue.toFixed(2)}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({service.commissionPercentage}%)
                      </span>
                    </td>
                    <td className="text-right py-2 px-2">R$ {service.totalCost.toFixed(2)}</td>
                    <td className={`text-right py-2 px-2 font-medium ${service.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {service.profit.toFixed(2)}
                    </td>
                    <td className="text-right py-2 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        service.profitMargin >= 30
                          ? "bg-green-100 text-green-800"
                          : service.profitMargin >= 15
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {service.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
