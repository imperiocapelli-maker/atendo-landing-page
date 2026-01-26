import { z } from "zod";
import { publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { coupons, subscriptionPlans } from "../../drizzle/schema";
import { eq, and, gt, lt, isNull } from "drizzle-orm";

export const couponRouter = {
  /**
   * Validar e aplicar cupom de desconto
   * Retorna o desconto calculado se o cupom for válido
   */
  validateCoupon: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Código do cupom é obrigatório"),
        planId: z.number().int().positive("ID do plano é obrigatório"),
        totalAmount: z.number().positive("Valor total é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      const { code, planId, totalAmount } = input;

      const db = await getDb();
      if (!db) {
        return {
          valid: false,
          error: "Banco de dados indisponível",
        };
      }

      // Buscar cupom
      const coupon = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, code.toUpperCase()))
        .limit(1);

      if (!coupon || coupon.length === 0) {
        return {
          valid: false,
          error: "Cupom não encontrado",
        };
      }

      const couponData = coupon[0];

      // Verificar se cupom está ativo
      if (!couponData.isActive) {
        return {
          valid: false,
          error: "Cupom expirado ou inativo",
        };
      }

      // Verificar datas de validade
      const now = new Date();
      if (couponData.validFrom && new Date(couponData.validFrom) > now) {
        return {
          valid: false,
          error: "Cupom ainda não está válido",
        };
      }

      if (couponData.validUntil && new Date(couponData.validUntil) < now) {
        return {
          valid: false,
          error: "Cupom expirado",
        };
      }

      // Verificar limite de usos
      if (
        couponData.maxUses &&
        couponData.currentUses &&
        couponData.currentUses >= couponData.maxUses
      ) {
        return {
          valid: false,
          error: "Cupom atingiu o limite de usos",
        };
      }

      // Verificar compra mínima
      if (
        couponData.minPurchaseAmount &&
        totalAmount < parseFloat(couponData.minPurchaseAmount.toString())
      ) {
        return {
          valid: false,
          error: `Compra mínima de R$ ${couponData.minPurchaseAmount} necessária`,
        };
      }

      // Verificar se cupom é aplicável ao plano
      if (couponData.applicablePlans) {
        try {
          const applicablePlans = JSON.parse(couponData.applicablePlans);
          if (!applicablePlans.includes(planId)) {
            return {
              valid: false,
              error: "Cupom não é válido para este plano",
            };
          }
        } catch {
          // Se não conseguir fazer parse, considerar como válido para todos
        }
      }

      // Calcular desconto
      let discountAmount = 0;
      if (couponData.discountType === "percentage") {
        discountAmount = (totalAmount * parseFloat(couponData.discountValue.toString())) / 100;
      } else {
        discountAmount = parseFloat(couponData.discountValue.toString());
      }

      // Não permitir desconto maior que o total
      discountAmount = Math.min(discountAmount, totalAmount);

      return {
        valid: true,
        couponId: couponData.id,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalAmount: parseFloat((totalAmount - discountAmount).toFixed(2)),
      };
    }),

  /**
   * Registrar uso de cupom após pagamento bem-sucedido
   */
  recordCouponUsage: publicProcedure
    .input(
      z.object({
        couponId: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Banco de dados indisponível");
        }

        const couponData = await db
          .select()
          .from(coupons)
          .where(eq(coupons.id, input.couponId))
          .limit(1);

        if (!couponData || couponData.length === 0) {
          throw new Error("Cupom não encontrado");
        }

        const newUses = (couponData[0].currentUses || 0) + 1;

        await db
          .update(coupons)
          .set({
            currentUses: newUses,
          })
          .where(eq(coupons.id, input.couponId));

        return { success: true };
      } catch (error) {
        console.error("Erro ao registrar uso de cupom:", error);
        return { success: false, error: "Erro ao registrar uso de cupom" };
      }
    }),
};
