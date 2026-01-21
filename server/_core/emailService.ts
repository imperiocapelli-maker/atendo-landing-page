import nodemailer from "nodemailer";

/**
 * Email service para enviar emails de boas-vindas com credenciais
 * Usa o serviço de email configurado via variáveis de ambiente
 */

// Configurar transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true para 465, false para outros portos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface WelcomeEmailData {
  email: string;
  name?: string;
  tempPassword: string;
  planName: string;
  loginUrl: string;
}

/**
 * Enviar email de boas-vindas com credenciais
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    // Se não houver credenciais SMTP, usar fallback (apenas log)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log("[Email] SMTP não configurado. Fallback para console:");
      console.log(`Email: ${data.email}`);
      console.log(`Senha Temporária: ${data.tempPassword}`);
      console.log(`Plano: ${data.planName}`);
      return true;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .credentials { background-color: #fff; padding: 15px; border-left: 4px solid #0066cc; margin: 15px 0; }
            .credentials p { margin: 8px 0; }
            .credentials strong { color: #0066cc; }
            .button { display: inline-block; background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bem-vindo ao Atendo!</h1>
            </div>

            <div class="content">
              <p>Olá${data.name ? ` ${data.name}` : ""}!</p>
              
              <p>Seu pagamento foi confirmado com sucesso! 🎊</p>
              
              <p>Você agora tem acesso ao plano <strong>${data.planName}</strong> do Atendo.</p>

              <h3>Suas Credenciais de Acesso:</h3>
              <div class="credentials">
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Senha Temporária:</strong> ${data.tempPassword}</p>
              </div>

              <p>⚠️ <strong>Importante:</strong> Esta é uma senha temporária. Você será solicitado a alterar sua senha no primeiro login.</p>

              <center>
                <a href="${data.loginUrl}" class="button">Fazer Login Agora</a>
              </center>

              <h3>Próximos Passos:</h3>
              <ol>
                <li>Clique no botão acima ou acesse <a href="${data.loginUrl}">${data.loginUrl}</a></li>
                <li>Faça login com suas credenciais</li>
                <li>Altere sua senha para uma senha segura</li>
                <li>Comece a usar o Atendo!</li>
              </ol>

              <p>Se você tiver dúvidas ou precisar de ajuda, não hesite em entrar em contato com nosso suporte.</p>

              <p>Obrigado por escolher o Atendo!</p>
            </div>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Atendo. Todos os direitos reservados.</p>
              <p>Este é um email automático. Por favor, não responda a este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Bem-vindo ao Atendo!

Seu pagamento foi confirmado com sucesso!

Você agora tem acesso ao plano ${data.planName} do Atendo.

Suas Credenciais de Acesso:
Email: ${data.email}
Senha Temporária: ${data.tempPassword}

IMPORTANTE: Esta é uma senha temporária. Você será solicitado a alterar sua senha no primeiro login.

Próximos Passos:
1. Acesse ${data.loginUrl}
2. Faça login com suas credenciais
3. Altere sua senha para uma senha segura
4. Comece a usar o Atendo!

Se você tiver dúvidas ou precisar de ajuda, entre em contato com nosso suporte.

Obrigado por escolher o Atendo!

© ${new Date().getFullYear()} Atendo. Todos os direitos reservados.
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@atendo.app",
      to: data.email,
      subject: `🎉 Bem-vindo ao Atendo! Suas credenciais de acesso`,
      text: textContent,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[Email] Enviado com sucesso para ${data.email}. Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email] Erro ao enviar email para ${data.email}:`, error);
    return false;
  }
}

/**
 * Gerar senha temporária aleatória
 */
export function generateTempPassword(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Gerar token de reset de senha
 */
export function generatePasswordResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
