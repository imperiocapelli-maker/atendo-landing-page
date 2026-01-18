import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb, createCalendlyWebhook, getCalendlyWebhooks } from "../db";
import { calendlyWebhooksTable } from "../../drizzle/schema";
import { sendWhatsAppMessage } from "../services/whatsapp";

// Schema para validar webhook do Calendly
const CalendlyWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    event_type: z.object({
      name: z.string(),
    }),
    scheduled_event: z.object({
      name: z.string(),
      start_time: z.string(),
      end_time: z.string(),
      event_memberships: z.array(
        z.object({
          user: z.object({
            name: z.string(),
            email: z.string(),
          }),
          invitee_start_time: z.string(),
        })
      ),
    }),
    invitee: z.object({
      name: z.string(),
      email: z.string(),
      phone_number: z.string().optional(),
      text_reminder_number: z.string().optional(),
    }).optional(),
  }),
});

export const calendlyRouter = router({
  // Webhook público para receber eventos do Calendly
  webhook: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      try {
        // Validar payload do Calendly
        const webhookData = CalendlyWebhookSchema.parse(input);

        // Extrair informações do agendamento
        const eventType = webhookData.payload.event_type.name;
        const scheduledEvent = webhookData.payload.scheduled_event;
        const invitee = webhookData.payload.invitee;

        // Obter informações do membro (especialista)
        const memberInfo = scheduledEvent.event_memberships[0];
        const memberName = memberInfo.user.name;
        const memberEmail = memberInfo.user.email;

        // Dados do agendamento
        const bookingData = {
          eventType,
          eventName: scheduledEvent.name,
          startTime: new Date(scheduledEvent.start_time),
          endTime: new Date(scheduledEvent.end_time),
          inviteeName: invitee?.name || "Visitante",
          inviteeEmail: invitee?.email || "",
          inviteePhone: invitee?.phone_number || invitee?.text_reminder_number || "",
          memberName,
          memberEmail,
        };

        // Salvar webhook no banco de dados para auditoria
        const db = await getDb();
        if (db) {
          await db.insert(calendlyWebhooksTable).values({
            eventType: webhookData.payload.event_type.name,
            payload: JSON.stringify(webhookData),
            inviteeName: bookingData.inviteeName,
            inviteeEmail: bookingData.inviteeEmail,
            inviteePhone: bookingData.inviteePhone,
            scheduledAt: bookingData.startTime,
            createdAt: new Date(),
          });
        }

        // Enviar notificação via WhatsApp se houver telefone
        if (bookingData.inviteePhone) {
          const message = formatWhatsAppMessage(bookingData);
          await sendWhatsAppMessage(
            bookingData.inviteePhone,
            message
          );
        }

        return {
          success: true,
          message: "Agendamento recebido e processado com sucesso",
          booking: bookingData,
        };
      } catch (error) {
        console.error("Erro ao processar webhook do Calendly:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    }),

  // Listar webhooks recebidos
  listWebhooks: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const webhooks = await getCalendlyWebhooks(input.limit);
      return webhooks;
    }),

  // Sincronizar agendamentos manualmente
  syncBookings: publicProcedure
    .mutation(async () => {
      try {
        const { syncCalendlyBookings } = await import("../services/calendlySync");
        await syncCalendlyBookings();
        return {
          success: true,
          message: "Sincronização iniciada com sucesso",
        };
      } catch (error) {
        console.error("Erro ao sincronizar agendamentos:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    }),
});

// Formatar mensagem WhatsApp
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
