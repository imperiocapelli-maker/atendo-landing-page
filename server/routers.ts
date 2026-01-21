import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { paymentRouter } from "./routers/payment";
import { leadsRouter } from "./routers/leads";
import { calendlyRouter } from "./routers/calendly";
import { pricingRouter } from "./routers/pricing";
import { servicesRouter } from "./routers/services";
import { authTestRouter } from "./routers/auth-test";
import { subscriptionRouter } from "./routers/subscription";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  payment: paymentRouter,
  leads: leadsRouter,
  calendly: calendlyRouter,
  pricing: pricingRouter,
  services: servicesRouter,
  authTest: authTestRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
