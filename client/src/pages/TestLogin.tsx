import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function TestLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("teste@example.com");
  const [password, setPassword] = useState("senha123");

  const testLoginMutation = trpc.authTest.testLogin.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        setLocation("/dashboard/precificacao-v2");
      }, 500);
    },
    onError: (error) => {
      toast.error(`Erro ao fazer login: ${error.message}`);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    testLoginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Login de Teste</CardTitle>
          <CardDescription>
            Use as credenciais abaixo para acessar o Dashboard de Precificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="teste@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={testLoginMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Senha
              </label>
              <Input
                type="password"
                placeholder="senha123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={testLoginMutation.isPending}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">Credenciais de Teste:</p>
              <p>Email: <code className="bg-white px-2 py-1 rounded">teste@example.com</code></p>
              <p>Senha: <code className="bg-white px-2 py-1 rounded">senha123</code></p>
            </div>

            <Button
              type="submit"
              disabled={testLoginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {testLoginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <p>Esta é uma página de teste para demonstração.</p>
              <p>Não use em produção.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
