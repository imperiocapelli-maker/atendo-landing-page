import { describe, it, expect } from "vitest";
import { generateTempPassword, generatePasswordResetToken } from "./emailService";

describe("Email Service", () => {
  it("should generate a temporary password with correct length", () => {
    const password = generateTempPassword(12);
    expect(password).toHaveLength(12);
  });

  it("should generate different passwords each time", () => {
    const password1 = generateTempPassword(12);
    const password2 = generateTempPassword(12);
    expect(password1).not.toBe(password2);
  });

  it("should generate password with special characters", () => {
    const password = generateTempPassword(20);
    const hasSpecial = /[!@#$%]/.test(password);
    expect(hasSpecial).toBe(true);
  });

  it("should generate a password reset token", () => {
    const token = generatePasswordResetToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });

  it("should generate different reset tokens", () => {
    const token1 = generatePasswordResetToken();
    const token2 = generatePasswordResetToken();
    expect(token1).not.toBe(token2);
  });

  it("should generate password with alphanumeric characters", () => {
    const password = generateTempPassword(20);
    const hasAlpha = /[a-zA-Z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    expect(hasAlpha).toBe(true);
    expect(hasNumeric).toBe(true);
  });

  it("should generate custom length password", () => {
    const password8 = generateTempPassword(8);
    const password16 = generateTempPassword(16);
    const password32 = generateTempPassword(32);
    
    expect(password8).toHaveLength(8);
    expect(password16).toHaveLength(16);
    expect(password32).toHaveLength(32);
  });
});
