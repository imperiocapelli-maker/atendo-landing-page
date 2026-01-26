import mysql from 'mysql2/promise';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function parseDatabaseUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 3306,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
  };
}

const INSTALLMENT_OPTIONS = [2, 3, 6, 12];

const PLANS = [
  { name: 'Essencial', annualPrice: 89 },
  { name: 'Profissional', annualPrice: 149 },
  { name: 'Premium', annualPrice: 249 },
  { name: 'Scale', annualPrice: 399 },
];

async function createInstallmentPlans() {
  let connection;
  try {
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connection = await mysql.createConnection({
      ...dbConfig,
      ssl: { rejectUnauthorized: false },
    });

    console.log('🚀 Iniciando criação de planos parcelados...\n');

    for (const plan of PLANS) {
      console.log(`📋 Processando plano: ${plan.name}`);

      // Obter plano anual para pegar o stripeProductId
      const [annualPlans] = await connection.execute(
        'SELECT id, stripeProductId FROM subscriptionPlans WHERE name = ? AND billingInterval = "yearly" AND (installments IS NULL OR installments = 1)',
        [plan.name]
      );

      if (!annualPlans.length) {
        console.log(`   ⚠️  Plano anual não encontrado, pulando...\n`);
        continue;
      }

      const stripeProductId = annualPlans[0].stripeProductId;

      for (const installments of INSTALLMENT_OPTIONS) {
        const pricePerInstallment = Math.round((plan.annualPrice / installments) * 100) / 100;

        console.log(`   → Criando preço para ${installments}x (R$ ${pricePerInstallment}/parcela)...`);

        // Criar preço no Stripe
        const price = await stripe.prices.create({
          product: stripeProductId,
          unit_amount: Math.round(pricePerInstallment * 100),
          currency: 'brl',
          recurring: {
            interval: 'month',
            interval_count: Math.ceil(12 / installments),
          },
          metadata: {
            installments: installments.toString(),
            plan_name: plan.name,
          },
        });

        console.log(`   ✅ Preço criado: ${price.id}`);

        // Inserir plano no banco
        await connection.execute(
          `INSERT INTO subscriptionPlans (name, price, currency, stripePriceId, stripeProductId, billingInterval, installments, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [plan.name, pricePerInstallment, 'BRL', price.id, stripeProductId, 'yearly', installments, 1]
        );

        console.log(`   ✅ Plano inserido no banco\n`);
      }
    }

    console.log('✅ Todos os planos parcelados foram criados com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createInstallmentPlans();
