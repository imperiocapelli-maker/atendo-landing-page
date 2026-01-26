import mysql from 'mysql2/promise';
import { URL } from 'url';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL não definida');
  process.exit(1);
}

const parsedUrl = new URL(dbUrl);
const config = {
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port || '3306'),
  user: parsedUrl.username,
  password: parsedUrl.password,
  database: parsedUrl.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false,
  },
};

async function createTestCoupons() {
  const connection = await mysql.createConnection(config);

  try {
    // Cupom 1: 10% de desconto para todos os planos
    await connection.execute(
      `INSERT INTO coupons (code, discountType, discountValue, isActive, validFrom, validUntil, maxUses, minPurchaseAmount, applicablePlans, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['DESCONTO10', 'percentage', 10, true, new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 100, 0, JSON.stringify([1, 2, 3, 4])]
    );

    // Cupom 2: 20% de desconto apenas para planos anuais
    await connection.execute(
      `INSERT INTO coupons (code, discountType, discountValue, isActive, validFrom, validUntil, maxUses, minPurchaseAmount, applicablePlans, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['ANNUAL20', 'percentage', 20, true, new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 50, 500, JSON.stringify([1, 2, 3, 4])]
    );

    // Cupom 3: R$ 50 de desconto
    await connection.execute(
      `INSERT INTO coupons (code, discountType, discountValue, isActive, validFrom, validUntil, maxUses, minPurchaseAmount, applicablePlans, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['SAVE50', 'fixed', 50, true, new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 200, 100, JSON.stringify([1, 2, 3, 4])]
    );

    // Cupom 4: 25% de desconto - Cupom exclusivo
    await connection.execute(
      `INSERT INTO coupons (code, discountType, discountValue, isActive, validFrom, validUntil, maxUses, minPurchaseAmount, applicablePlans, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['EXCLUSIVE25', 'percentage', 25, true, new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 10, 1000, JSON.stringify([3, 4])]
    );

    console.log('✅ 4 cupons de teste criados com sucesso!');
    console.log('\nCupons disponíveis:');
    console.log('1. DESCONTO10 - 10% de desconto (todos os planos)');
    console.log('2. ANNUAL20 - 20% de desconto (compra mínima R$ 500)');
    console.log('3. SAVE50 - R$ 50 de desconto (compra mínima R$ 100)');
    console.log('4. EXCLUSIVE25 - 25% de desconto (apenas planos Premium e Scale)');
  } catch (error) {
    console.error('Erro ao criar cupons:', error);
  } finally {
    await connection.end();
  }
}

createTestCoupons();
