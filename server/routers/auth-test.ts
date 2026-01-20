import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Test user credentials
const TEST_USER = {
  email: "teste@example.com",
  password: "senha123",
  name: "Usuário Teste",
};

export const authTestRouter = router({
  testLogin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify test credentials
      if (input.email !== TEST_USER.email || input.password !== TEST_USER.password) {
        throw new Error("Email ou senha inválidos");
      }

      // Get database instance
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Find test user by email
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, TEST_USER.email))
        .limit(1);

      let user = existingUser[0];

      if (!user) {
        // Create test user if doesn't exist
        await db.insert(users).values({
          email: TEST_USER.email,
          name: TEST_USER.name,
          role: "user",
          openId: `test-${Date.now()}`,
          lastSignedIn: new Date(),
        });

        // Fetch the created user
        const created = await db
          .select()
          .from(users)
          .where(eq(users.email, TEST_USER.email))
          .limit(1);

        user = created[0];
      }

      if (!user) {
        throw new Error("Failed to create or find test user");
      }

      // Create session cookie
      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, JSON.stringify(sessionData), cookieOptions);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  testLogout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
});
