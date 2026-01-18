import { ENV } from "../_core/env";
import { getDb, createCalendlyWebhook, updateCalendlyWebhookStatus } from "../db";
import { calendlyWebhooksTable } from "../../drizzle/schema";
import { sendWhatsAppMessage } from "./whatsapp";
import { eq } from "drizzle-orm";

interface CalendlyEvent {
  resource: {
    uri: string;
    name: string;
    start_time: string;
    end_time: string;
  };
  invitees: Array<{
    name: string;
    email: string;
    phone_number?: string;
    text_reminder_number?: string;
  }>;
  organizer: {
    name: string;
    email: string;
  };
}

/**
 * Sincronizar agendamentos do Calendly
 * Esta função busca os últimos agendamentos do Calendly e envia notificações WhatsApp
 */
export async function syncCalendlyBookings(): Promise<void> {
  try {
    console.log("[CalendlySync] Iniciando sincronização de agendamentos...");

    // Buscar últimos agendamentos do Calendly via API
    const bookings = await fetchCalendlyBookings();

    if (!bookings || bookings.length === 0) {
      console.log("[CalendlySync] Nenhum agendamento novo encontrado");
      return;
    }

    console.log(`[CalendlySync] ${bookings.length} agendamento(s) encontrado(s)`);

    // Processar cada agendamento
    for (const booking of bookings) {
      await processCalendlyBooking(booking);
    }

    console.log("[CalendlySync] Sincronização concluída");
  } catch (error) {
    console.error("[CalendlySync] Erro ao sincronizar agendamentos:", error);
  }
}

/**
 * Buscar agendamentos do Calendly via API
 */
async function fetchCalendlyBookings(): Promise<CalendlyEvent[]> {
  try {
    // Usar a API do Calendly para buscar eventos
    // Você precisa configurar uma chave de API do Calendly
    const response = await fetch("https://api.calendly.com/scheduled_events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("[CalendlySync] Erro ao buscar agendamentos:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.collection || [];
  } catch (error) {
    console.error("[CalendlySync] Erro ao fazer requisição para Calendly:", error);
    return [];
  }
}

/**
 * Processar um agendamento do Calendly
 */
async function processCalendlyBooking(booking: CalendlyEvent): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[CalendlySync] Database não disponível");
      return;
    }

    // Extrair informações do agendamento
    const invitee = booking.invitees[0];
    if (!invitee) {
      console.warn("[CalendlySync] Nenhum convidado encontrado no agendamento");
      return;
    }

    const phoneNumber = invitee.phone_number || invitee.text_reminder_number;
    if (!phoneNumber) {
      console.warn(`[CalendlySync] Nenhum telefone encontrado para ${invitee.email}`);
      return;
    }

    // Verificar se o agendamento já foi processado
    const existingBooking = await db
      .select()
      .from(calendlyWebhooksTable)
      .where(eq(calendlyWebhooksTable.inviteeEmail, invitee.email))
      .limit(1);

    if (existingBooking.length > 0) {
      console.log(`[CalendlySync] Agendamento para ${invitee.email} já foi processado`);
      return;
    }

    // Salvar agendamento no banco de dados
    const webhookRecord = await db.insert(calendlyWebhooksTable).values({
      eventType: "invitee.created",
      payload: JSON.stringify(booking),
      inviteeName: invitee.name,
      inviteeEmail: invitee.email,
      inviteePhone: phoneNumber,
      scheduledAt: new Date(booking.resource.start_time),
      createdAt: new Date(),
    });

    // Enviar notificação WhatsApp
    const message = formatWhatsAppMessage({
      inviteeName: invitee.name,
      eventName: booking.resource.name,
      startTime: new Date(booking.resource.start_time),
      memberName: booking.organizer.name,
    });

    const result = await sendWhatsAppMessage(phoneNumber, message);

    // Atualizar status do webhook
    if (result.success) {
      await updateCalendlyWebhookStatus(
        (webhookRecord as any).insertId || 0,
        "sent"
      );
      console.log(`[CalendlySync] Notificação enviada para ${phoneNumber}`);
    } else {
      await updateCalendlyWebhookStatus(
        (webhookRecord as any).insertId || 0,
        "failed",
        result.error
      );
      console.error(`[CalendlySync] Erro ao enviar notificação: ${result.error}`);
    }
  } catch (error) {
    console.error("[CalendlySync] Erro ao processar agendamento:", error);
  }
}

/**
 * Formatar mensagem WhatsApp
 */
function formatWhatsAppMessage(booking: {
  inviteeName: string;
  eventName: string;
  startTime: Date;
  memberName: string;
}): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = booking.startTime.toLocaleDateString("pt-BR", options);

  return `Olá ${booking.inviteeName}! 👋

Seu agendamento foi confirmado com sucesso! 🎉

📅 *Evento:* ${booking.eventName}
⏰ *Data e Hora:* ${formattedDate}
👤 *Especialista:* ${booking.memberName}

Você receberá um link de videoconferência por email em breve.

Qualquer dúvida, estamos à disposição! 😊

Atendo - Sistema de Gestão B2B`;
}
