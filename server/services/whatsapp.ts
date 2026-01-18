import { ENV } from "../_core/env";

/**
 * Enviar mensagem via WhatsApp usando API da Manus
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validar número de telefone
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return {
        success: false,
        error: "Número de telefone inválido",
      };
    }

    // Usar API da Manus para enviar mensagem WhatsApp
    const response = await fetch(`${ENV.forgeApiUrl}/whatsapp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[WhatsApp] Erro ao enviar mensagem:", errorData);
      return {
        success: false,
        error: errorData.message || "Erro ao enviar mensagem WhatsApp",
      };
    }

    const data = await response.json();
    console.log("[WhatsApp] Mensagem enviada com sucesso:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[WhatsApp] Erro ao enviar mensagem:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Enviar mensagem WhatsApp com template pré-definido
 */
export async function sendWhatsAppTemplate(
  phoneNumber: string,
  templateName: string,
  variables?: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/whatsapp/send-template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        templateName: templateName,
        variables: variables || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[WhatsApp Template] Erro ao enviar template:", errorData);
      return {
        success: false,
        error: errorData.message || "Erro ao enviar template WhatsApp",
      };
    }

    const data = await response.json();
    console.log("[WhatsApp Template] Template enviado com sucesso:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[WhatsApp Template] Erro ao enviar template:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
