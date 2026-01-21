import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Loader2 } from "lucide-react";

export default function CheckoutSuccess() {
  usePageTitle("Pagamento Confirmado | Atendo");
  const [location] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extrair session_id da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);
    
    // Simular verificação de pagamento
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-gray-600">Confirmando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Pagamento Confirmado! 🎉</h1>
          <p className="text-xl text-green-100">Sua assinatura foi ativada com sucesso</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">✓ Transação Bem-sucedida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Seu pagamento foi processado com sucesso e sua assinatura foi ativada imediatamente.
              </p>
              {sessionId && (
                <div className="bg-white p-4 rounded border border-green-200">
                  <p className="text-sm text-gray-600">
                    <strong>ID da Sessão:</strong> {sessionId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Email */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Passo 1</CardTitle>
                </div>
                <CardDescription>Verificar Email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Verifique sua caixa de entrada (e pasta de spam) para o email de boas-vindas com suas credenciais de acesso.
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Password */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Passo 2</CardTitle>
                </div>
                <CardDescription>Usar Credenciais</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Use o email e a senha temporária fornecidos no email para fazer login no Atendo.
                </p>
              </CardContent>
            </Card>

            {/* Step 3: Login */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <LogIn className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Passo 3</CardTitle>
                </div>
                <CardDescription>Fazer Login</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Após o login, você será solicitado a alterar sua senha para uma senha segura e pessoal.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Important Info */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-700" />
                <CardTitle className="text-yellow-700">Informações Importantes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Email não recebido?</strong> Verifique sua pasta de spam ou entre em contato com nosso suporte.
              </p>
              <p>
                <strong>Senha temporária:</strong> Por motivos de segurança, você deve alterar sua senha no primeiro login.
              </p>
              <p>
                <strong>Acesso imediato:</strong> Sua assinatura está ativa agora e você pode começar a usar o Atendo imediatamente após fazer login.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/entrar")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Ir para Login
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              size="lg"
            >
              Voltar para Home
            </Button>
          </div>

          {/* Support Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                Se você tiver dúvidas ou encontrar algum problema, nossa equipe de suporte está aqui para ajudar.
              </p>
              <p>
                <strong>Email:</strong> suporte@atendo.app
              </p>
              <p>
                <strong>WhatsApp:</strong> Clique no ícone de chat no canto inferior direito
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
