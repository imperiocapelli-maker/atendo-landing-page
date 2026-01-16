import twilio from "twilio";

// Inicializar cliente Twilio
let twilioClient: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch (error) {
      console.error("[Twilio] Failed to initialize client:", error);
      return null;
    }
  }
  return twilioClient;
}

// Templates de mensagens por país
const messageTemplates: Record<string, Record<string, string>> = {
  br: {
    welcome: `Olá! 👋 Bem-vindo ao *Atendo*!

Recebemos seu interesse em nosso sistema de gestão B2B para salões e clínicas.

Estamos aqui para ajudar você a:
✅ Organizar sua agenda
✅ Controlar seu financeiro
✅ Aumentar seus lucros com precificação inteligente

Um especialista entrará em contato em breve para agendar sua demonstração gratuita.

Dúvidas? Estamos aqui! 😊`,
    demo: `Oi! Tudo bem? 

Gostaria de agendar uma demonstração do Atendo? Clique no link abaixo:
https://seu-dominio.com/agendar-demo

Ou responda este WhatsApp para falar com um especialista!`,
  },
  ar: {
    welcome: `¡Hola! 👋 ¡Bienvenido a *Atendo*!

Recibimos tu interés en nuestro sistema de gestión B2B para salones y clínicas.

Estamos aquí para ayudarte a:
✅ Organizar tu agenda
✅ Controlar tus finanzas
✅ Aumentar tus ganancias con precios inteligentes

Un especialista se pondrá en contacto pronto para agendar tu demostración gratuita.

¿Preguntas? ¡Estamos aquí! 😊`,
    demo: `¡Hola! ¿Qué tal?

¿Te gustaría agendar una demostración de Atendo? Haz clic en el enlace a continuación:
https://tu-dominio.com/agendar-demo

¡O responde este WhatsApp para hablar con un especialista!`,
  },
  py: {
    welcome: `¡Hola! 👋 ¡Bienvenido a *Atendo*!

Recibimos tu interés en nuestro sistema de gestión B2B para salones y clínicas.

Estamos aquí para ayudarte a:
✅ Organizar tu agenda
✅ Controlar tus finanzas
✅ Aumentar tus ganancias con precios inteligentes

Un especialista se pondrá en contacto pronto para agendar tu demostración gratuita.

¿Preguntas? ¡Estamos aquí! 😊`,
    demo: `¡Hola! ¿Qué tal?

¿Te gustaría agendar una demostración de Atendo? Haz clic en el enlace a continuación:
https://tu-dominio.com/agendar-demo

¡O responde este WhatsApp para hablar con un especialista!`,
  },
};

export interface SendWhatsAppMessageParams {
  to: string; // Número com código de país (ex: +5511987654321)
  country: "br" | "ar" | "py";
  messageType: "welcome" | "demo";
  name?: string;
}

export async function sendWhatsAppMessage(params: SendWhatsAppMessageParams): Promise<boolean> {
  const client = getTwilioClient();

  if (!client) {
    console.warn("[WhatsApp] Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
    return false;
  }

  if (!process.env.TWILIO_WHATSAPP_NUMBER) {
    console.warn("[WhatsApp] TWILIO_WHATSAPP_NUMBER not configured.");
    return false;
  }

  try {
    const template = messageTemplates[params.country]?.[params.messageType];

    if (!template) {
      console.error(`[WhatsApp] Template not found for country: ${params.country}, type: ${params.messageType}`);
      return false;
    }

    // Personalizar mensagem com nome se fornecido
    let message = template;
    if (params.name) {
      message = message.replace("Olá!", `Olá ${params.name}!`).replace("¡Hola!", `¡Hola ${params.name}!`);
    }

    // Enviar mensagem via Twilio WhatsApp
    const result = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${params.to}`,
      body: message,
    });

    console.log(`[WhatsApp] Message sent successfully. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Failed to send message:", error);
    return false;
  }
}

// Enviar múltiplas mensagens
export async function sendBulkWhatsAppMessages(
  leads: Array<{ phone: string; country: "br" | "ar" | "py"; name?: string }>
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const success = await sendWhatsAppMessage({
      to: lead.phone,
      country: lead.country,
      messageType: "welcome",
      name: lead.name,
    });

    if (success) {
      sent++;
    } else {
      failed++;
    }

    // Delay para evitar rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { sent, failed };
}
