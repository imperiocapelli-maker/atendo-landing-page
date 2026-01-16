import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createLead, getLeads, getLeadsByStatus, updateLeadStatus, updateLeadWebhookStatus } from "../db";
import axios from "axios";

// Validação de número de WhatsApp
const phoneSchema = z.object({
  phoneNumber: z.string().min(10).max(20),
  formattedPhone: z.string(),
  country: z.enum(["br", "ar", "py"]),
  language: z.string().default("pt"),
  currency: z.string().default("BRL"),
  source: z.string().default("exit_intent"),
});

export const leadsRouter = router({
  // Capturar novo lead
  captureLead: publicProcedure.input(phoneSchema).mutation(async ({ input }) => {
    try {
      // Criar lead no banco de dados
      const lead = await createLead({
        phoneNumber: input.phoneNumber,
        formattedPhone: input.formattedPhone,
        country: input.country,
        language: input.language,
        currency: input.currency,
        source: input.source,
        status: "new",
        zapierWebhookSent: "pending",
      });

      // Enviar para Zapier/Make webhook (se configurado)
      if (process.env.ZAPIER_WEBHOOK_URL) {
        try {
          const webhookPayload = {
            phoneNumber: input.formattedPhone,
            country: input.country,
            language: input.language,
            currency: input.currency,
            source: input.source,
            timestamp: new Date().toISOString(),
            message: `Novo lead capturado: ${input.formattedPhone}`,
          };

          const response = await axios.post(process.env.ZAPIER_WEBHOOK_URL, webhookPayload, {
            timeout: 5000,
          });

          // Atualizar status do webhook
          if (lead) {
            await updateLeadWebhookStatus(lead.id, "sent", JSON.stringify(response.data));
          }

          return {
            success: true,
            leadId: lead?.id,
            webhookSent: true,
            message: "Lead capturado e enviado para automação",
          };
        } catch (webhookError) {
          console.error("[Zapier] Webhook error:", webhookError);

          // Mesmo que o webhook falhe, o lead foi criado
          if (lead) {
            await updateLeadWebhookStatus(lead.id, "failed", String(webhookError));
          }

          return {
            success: true,
            leadId: lead?.id,
            webhookSent: false,
            message: "Lead capturado (webhook falhou, será retentado)",
          };
        }
      }

      return {
        success: true,
        leadId: lead?.id,
        webhookSent: false,
        message: "Lead capturado com sucesso",
      };
    } catch (error) {
      console.error("[Leads] Error capturing lead:", error);
      throw new Error("Falha ao capturar lead");
    }
  }),

  // Listar todos os leads
  listLeads: publicProcedure.query(async () => {
    try {
      const leads = await getLeads(100);
      return {
        success: true,
        leads,
        total: leads.length,
      };
    } catch (error) {
      console.error("[Leads] Error listing leads:", error);
      return {
        success: false,
        leads: [],
        total: 0,
      };
    }
  }),

  // Listar leads por status
  listLeadsByStatus: publicProcedure.input(z.object({ status: z.string() })).query(async ({ input }) => {
    try {
      const leads = await getLeadsByStatus(input.status);
      return {
        success: true,
        leads,
        total: leads.length,
      };
    } catch (error) {
      console.error("[Leads] Error listing leads by status:", error);
      return {
        success: false,
        leads: [],
        total: 0,
      };
    }
  }),

  // Atualizar status do lead
  updateLeadStatus: publicProcedure
    .input(
      z.object({
        leadId: z.number(),
        status: z.enum(["new", "contacted", "interested", "converted", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateLeadStatus(input.leadId, input.status);
        return {
          success: true,
          message: "Status do lead atualizado",
        };
      } catch (error) {
        console.error("[Leads] Error updating lead status:", error);
        throw new Error("Falha ao atualizar status do lead");
      }
    }),

  // Estatísticas de leads
  getStats: publicProcedure.query(async () => {
    try {
      const allLeads = await getLeads(1000);

      const stats = {
        total: allLeads.length,
        new: allLeads.filter((l) => l.status === "new").length,
        contacted: allLeads.filter((l) => l.status === "contacted").length,
        interested: allLeads.filter((l) => l.status === "interested").length,
        converted: allLeads.filter((l) => l.status === "converted").length,
        rejected: allLeads.filter((l) => l.status === "rejected").length,
        webhookPending: allLeads.filter((l) => l.zapierWebhookSent === "pending").length,
        webhookFailed: allLeads.filter((l) => l.zapierWebhookSent === "failed").length,
        byCountry: {
          br: allLeads.filter((l) => l.country === "br").length,
          ar: allLeads.filter((l) => l.country === "ar").length,
          py: allLeads.filter((l) => l.country === "py").length,
        },
      };

      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error("[Leads] Error getting stats:", error);
      return {
        success: false,
        stats: {},
      };
    }
  }),
});
