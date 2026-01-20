import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingParametersTab } from "@/components/pricing/PricingParametersTab";
import { ServicesDefinitionTab } from "@/components/pricing/ServicesDefinitionTab";
import { PricingDashboardTab } from "@/components/pricing/PricingDashboardTab";
import { AlertCircle } from "lucide-react";

export default function PricingDashboard() {
  const [activeTab, setActiveTab] = useState("parameters");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard de Precificação</h1>
          <p className="text-muted-foreground">
            Gerencie seus custos fixos, defina serviços e calcule preços sugeridos com margem de lucro inteligente
          </p>
        </div>

        {/* Alert */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">Dica:</p>
              <p className="text-sm text-blue-800">
                Comece preenchendo seus parâmetros de custo na aba "Parâmetros", depois cadastre seus serviços e visualize os preços sugeridos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-t-lg rounded-b-none border-b">
              <TabsTrigger value="parameters" className="rounded-none">
                Parâmetros
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-none">
                Serviços
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="rounded-none">
                Dashboard
              </TabsTrigger>
            </TabsList>

            {/* Aba Parâmetros */}
            <TabsContent value="parameters" className="p-6">
              <PricingParametersTab />
            </TabsContent>

            {/* Aba Serviços */}
            <TabsContent value="services" className="p-6">
              <ServicesDefinitionTab />
            </TabsContent>

            {/* Aba Dashboard */}
            <TabsContent value="dashboard" className="p-6">
              <PricingDashboardTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
