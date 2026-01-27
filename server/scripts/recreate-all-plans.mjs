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

// Preços mensais corretos
const PLANS = [
  { name: 'Essencial', monthlyPrice: 111, annualPrice: 1065.60 },
  { name: 'Profissional', monthlyPrice: 186, annualPrice: 1785.60 },
  { name: 'Premium', monthlyPrice: 311, annualPrice: 2985.60 },
  { name: 'Scale', monthlyPrice: 498, annualPrice: 4780.80 },
];

const INSTALLMENT_OPTIONS = [2, 3, 6, 12];

async function recreateAllPlans() {
  let connection;
  try {
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connection = await mysql.createConnection({
      ...dbConfig,
      ssl: { rejectUnauthorized: false },
    });

    console.log('🚀 Iniciando recriação de todos os planos...\n');

    for (const plan of PLANS) {
      console.log(`📋 Processando plano: ${plan.name}`);

      // Criar produto no Stripe
      const product = await stripe.products.create({
        name: plan.name,
        description: `Plano ${plan.name} do Atendo`,
      });

      console.log(`   ✅ Produto Stripe criado: ${product.id}`);

      // 1. Criar preço mensal
      console.log(`   → Criando preço mensal (R$ ${plan.monthlyPrice}/mês)...`);
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(plan.monthlyPrice * 100),
        currency: 'brl',
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan_name: plan.name,
          billing_interval: 'monthly',
        },
      });

      console.log(`   ✅ Preço mensal criado: ${monthlyPrice.id}`);

      // Inserir plano mensal no banco
      await connection.execute(
        `INSERT INTO subscriptionPlans (name, price, currency, stripePriceId, stripeProductId, billingInterval, installments, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [plan.name, plan.monthlyPrice, 'BRL', monthlyPrice.id, product.id, 'monthly', 1, 1]
      );

      console.log(`   ✅ Plano mensal inserido no banco\n`);

      // 2. Criar preço anual
      console.log(`   → Criando preço anual (R$ ${plan.annualPrice}/ano)...`);
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(plan.annualPrice * 100),
        currency: 'brl',
        recurring: {
          interval: 'year',
        },
        metadata: {
          plan_name: plan.name,
          billing_interval: 'yearly',
        },
      });

      console.log(`   ✅ Preço anual criado: ${annualPrice.id}`);

      // Inserir plano anual no banco
      await connection.execute(
        `INSERT INTO subscriptionPlans (name, price, currency, stripePriceId, stripeProductId, billingInterval, installments, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [plan.name, plan.annualPrice, 'BRL', annualPrice.id, product.id, 'yearly', 1, 1]
      );

      console.log(`   ✅ Plano anual inserido no banco\n`);

      // 3. Criar preços parcelados
      for (const installments of INSTALLMENT_OPTIONS) {
        const pricePerInstallment = Math.round((plan.annualPrice / installments) * 100) / 100;

        console.log(`   → Criando preço para ${installments}x (R$ ${pricePerInstallment}/parcela)...`);

        // Criar preço no Stripe
        const installmentPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(pricePerInstallment * 100),
          currency: 'brl',
          recurring: {
            interval: 'month',
            interval_count: Math.ceil(12 / installments),
          },
          metadata: {
            installments: installments.toString(),
            plan_name: plan.name,
            billing_interval: 'yearly',
          },
        });

        console.log(`   ✅ Preço parcelado criado: ${installmentPrice.id}`);

        // Inserir plano parcelado no banco
        await connection.execute(
          `INSERT INTO subscriptionPlans (name, price, currency, stripePriceId, stripeProductId, billingInterval, installments, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [plan.name, pricePerInstallment, 'BRL', installmentPrice.id, product.id, 'yearly', installments, 1]
        );

        console.log(`   ✅ Plano parcelado inserido no banco\n`);
      }
    }

    console.log('✅ Todos os planos foram criados com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - 4 planos principais`);
    console.log(`   - 4 opções de cobrança por plano (mensal, anual, 2x, 3x, 6x, 12x)`);
    console.log(`   - Total: 28 registros de planos`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

recreateAllPlans();
