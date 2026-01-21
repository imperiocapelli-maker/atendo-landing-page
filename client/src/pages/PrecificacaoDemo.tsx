import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { LogOut } from "lucide-react";
import { AtendoLogo } from "@/components/AtendoLogo";

export default function PrecificacaoDemo() {
  const [lucroDesejado, setLucroDesejado] = useState(10);
  const [marketing, setMarketing] = useState(2);
  const [taxaCartao, setTaxaCartao] = useState(4);
  const [imposto, setImposto] = useState(4.8);
  const [custoFixo, setCustoFixo] = useState(36.45);

  const totalCustos = lucroDesejado + marketing + taxaCartao + imposto + custoFixo;

  const custosData = [
    { name: "Lucro Desejado", value: lucroDesejado },
    { name: "Marketing", value: marketing },
    { name: "Taxa de Cartão", value: taxaCartao },
    { name: "Imposto", value: imposto },
    { name: "Custo Fixo + Investimento", value: custoFixo },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

  const servicos = [
    { nome: "BABY LISS", comissao: 30, custo: 7 },
    { nome: "BARBA", comissao: 40, custo: 2 },
    { nome: "BARBA MAQUINA", comissao: 40, custo: 1 },
    { nome: "CAMUFLAGEM BARBA", comissao: 25, custo: 5 },
    { nome: "CAMUFLAGEM CABELO", comissao: 25, custo: 7 },
  ];

  const calcularPrecoSugerido = (comissao: number, custo: number) => {
    const custoComissao = (comissao / 100) * 100;
    return ((custoComissao + custo) / (1 - totalCustos / 100)).toFixed(2);
  };

  const dashboardData = servicos.map((s) => {
    const precoSugerido = parseFloat(calcularPrecoSugerido(s.comissao, s.custo));
    const valorComissao = (s.comissao / 100) * 100;
    const lucroFinanceiro = precoSugerido - valorComissao - s.custo;
    const lucroPercentual = ((lucroFinanceiro / precoSugerido) * 100).toFixed(2);

    return {
      servico: s.nome,
      precoAtual: 50,
      comissao: `${s.comissao}%`,
      valorComissao: valorComissao.toFixed(2),
      custoProduto: s.custo.toFixed(2),
      precoSugerido: precoSugerido,
      lucroFinanceiro: lucroFinanceiro.toFixed(2),
      lucroPercentual: parseFloat(lucroPercentual),
    };
  });

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleReset = () => {
    setLucroDesejado(10);
    setMarketing(2);
    setTaxaCartao(4);
    setImposto(4.8);
    setCustoFixo(36.45);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <AtendoLogo size="md" showText={true} className="text-white" />
          <h1 className="text-2xl font-bold">Dashboard de Preço 2026</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="parametros" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
            <TabsTrigger value="servicos">Como Atualizar</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard de Preço</TabsTrigger>
          </TabsList>

          {/* Aba Parâmetros */}
          <TabsContent value="parametros">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="bg-yellow-400 text-black p-2 rounded">
                    Definição de Custos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Lucro Desejado */}
                    <div>
                      <label className="text-sm font-medium block mb-2">Lucro Desejado (%)</label>
                      <input
                        type="number"
                        value={lucroDesejado}
                        onChange={(e) => setLucroDesejado(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        step="0.1"
                      />
                      <p className="text-2xl font-bold text-green-600 mt-2">{lucroDesejado}%</p>
                    </div>

                    {/* Marketing */}
                    <div>
                      <label className="text-sm font-medium block mb-2">Marketing (%)</label>
                      <input
                        type="number"
                        value={marketing}
                        onChange={(e) => setMarketing(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        step="0.1"
                      />
                      <p className="text-2xl font-bold text-yellow-600 mt-2">{marketing}%</p>
                    </div>

                    {/* Taxa de Cartão */}
                    <div>
                      <label className="text-sm font-medium block mb-2">Taxa de Cartão (%)</label>
                      <input
                        type="number"
                        value={taxaCartao}
                        onChange={(e) => setTaxaCartao(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                      />
                      <p className="text-2xl font-bold text-blue-600 mt-2">{taxaCartao}%</p>
                    </div>

                    {/* Imposto */}
                    <div>
                      <label className="text-sm font-medium block mb-2">Imposto (%)</label>
                      <input
                        type="number"
                        value={imposto}
                        onChange={(e) => setImposto(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        step="0.1"
                      />
                      <p className="text-2xl font-bold text-red-600 mt-2">{imposto}%</p>
                    </div>

                    {/* Custo Fixo + Investimento */}
                    <div className="col-span-2">
                      <label className="text-sm font-medium block mb-2">Custo Fixo + Investimento (%)</label>
                      <input
                        type="number"
                        value={custoFixo}
                        onChange={(e) => setCustoFixo(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        step="0.1"
                      />
                      <p className="text-2xl font-bold text-purple-600 mt-2">{custoFixo}%</p>
                    </div>
                  </div>

                  {/* Total e Botão Reset */}
                  <div className="pt-4 border-t space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Custos + Investimentos</p>
                      <p className="text-3xl font-bold text-gray-900">{totalCustos.toFixed(2)}%</p>
                    </div>
                    <Button onClick={handleReset} variant="outline" className="w-full">
                      Restaurar Valores Padrão
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Custos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={custosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {custosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(2) : value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Como Atualizar */}
          <TabsContent value="servicos">
            <Card>
              <CardHeader>
                <CardTitle className="bg-yellow-400 text-black p-2 rounded">
                  Definição de Serviços, Comissões e Custos de Produto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 text-left">Serviços</th>
                        <th className="px-4 py-2 text-center">Comissão</th>
                        <th className="px-4 py-2 text-center">Custo de Produto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicos.map((s, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                          <td className="px-4 py-2 font-medium">{s.nome}</td>
                          <td className="px-4 py-2 text-center bg-green-100">{s.comissao}%</td>
                          <td className="px-4 py-2 text-center bg-red-100">R$ {s.custo.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Dashboard de Preço */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle className="bg-blue-900 text-white p-3 rounded">
                  Dashboard de Preço 2026
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="px-3 py-2 text-left">Serviços</th>
                      <th className="px-3 py-2 text-center bg-orange-500">Preço Atual</th>
                      <th className="px-3 py-2 text-center bg-green-500">Comissão</th>
                      <th className="px-3 py-2 text-center">Valor Comissão</th>
                      <th className="px-3 py-2 text-center bg-red-500">Custo de Produto</th>
                      <th className="px-3 py-2 text-center bg-blue-500">Preço Sujerido</th>
                      <th className="px-3 py-2 text-center">Lucro Financeiro</th>
                      <th className="px-3 py-2 text-center">Lucro %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.map((d, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-3 py-2 font-medium">{d.servico}</td>
                        <td className="px-3 py-2 text-center bg-orange-100">R$ {d.precoAtual}</td>
                        <td className="px-3 py-2 text-center bg-green-100">{d.comissao}</td>
                        <td className="px-3 py-2 text-center">R$ {d.valorComissao}</td>
                        <td className="px-3 py-2 text-center bg-red-100">R$ {d.custoProduto}</td>
                        <td className="px-3 py-2 text-center bg-blue-100">R$ {d.precoSugerido}</td>
                        <td className="px-3 py-2 text-center">R$ {d.lucroFinanceiro}</td>
                        <td className={`px-3 py-2 text-center font-bold ${
                          d.lucroPercentual > 10 ? "bg-green-200" : d.lucroPercentual > 5 ? "bg-yellow-200" : "bg-red-200"
                        }`}>
                          {d.lucroPercentual}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
