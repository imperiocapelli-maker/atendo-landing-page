import Stripe from 'stripe';
import { createConnection } from 'mysql2/promise';
import { URL } from 'url';
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

// Mapeamento de nomes e preços
const plansConfig = {
  'Básico': {
    annualPrice: 8900,      // 89 BRL em centavos
    monthlyPrice: 11100,    // 111 BRL em centavos (89 + 25%)
    displayName: 'Essencial'
  },
  'Profissional': {
    annualPrice: 14900,     // 149 BRL em centavos
    monthlyPrice: 18600,    // 186 BRL em centavos (149 + 25%)
    displayName: 'Profissional'
  },
  'Enterprise': {
    annualPrice: 24900,     // 249 BRL em centavos
    monthlyPrice: 31100,    // 311 BRL em centavos (249 + 25%)
    displayName: 'Premium'
  },
  'Scale': {
    annualPrice: 39900,     // 399 BRL em centavos
    monthlyPrice: 49800,    // 498 BRL em centavos (399 + 25%)
    displayName: 'Scale'
  }
};

async function addBillingIntervals() {
  let connection;
  try {
    console.log('🚀 Iniciando adição de intervalos de faturamento...\n');

    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connection = await createConnection({
      ...dbConfig,
      ssl: { rejectUnauthorized: false },
    });

    // Para cada plano, criar versão anual e mensal
    for (const [currentName, config] of Object.entries(plansConfig)) {
      console.log(`📋 Processando plano: ${currentName}`);

      // Buscar plano atual
      const [existingPlans] = await connection.query(
        'SELECT * FROM subscriptionPlans WHERE name = ? LIMIT 1',
        [currentName]
      );

      if (existingPlans.length === 0) {
        console.log(`   ⚠️  Plano não encontrado, pulando...\n`);
        continue;
      }

      const currentPlan = existingPlans[0];
      console.log(`   ✅ Plano encontrado: ${currentPlan.name}`);

      // Criar preço anual no Stripe
      console.log(`   → Criando preço anual no Stripe...`);
      const annualPrice = await stripe.prices.create({
        unit_amount: config.annualPrice,
        currency: 'brl',
        recurring: {
          interval: 'year',
          interval_count: 1,
        },
        product: currentPlan.stripeProductId,
        billing_scheme: 'per_unit',
        metadata: {
          plan: config.displayName.toLowerCase(),
          billing: 'yearly'
        }
      });
      console.log(`   ✅ Preço anual criado: ${annualPrice.id}`);

      // Criar preço mensal no Stripe
      console.log(`   → Criando preço mensal no Stripe...`);
      const monthlyPrice = await stripe.prices.create({
        unit_amount: config.monthlyPrice,
        currency: 'brl',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        product: currentPlan.stripeProductId,
        billing_scheme: 'per_unit',
        metadata: {
          plan: config.displayName.toLowerCase(),
          billing: 'monthly'
        }
      });
      console.log(`   ✅ Preço mensal criado: ${monthlyPrice.id}`);

      // Atualizar plano atual para anual
      console.log(`   → Atualizando plano atual para anual...`);
      await connection.query(
        `UPDATE subscriptionPlans 
         SET name = ?, price = ?, stripePriceId = ?, billingInterval = 'yearly', updatedAt = NOW()
         WHERE id = ?`,
        [config.displayName, config.annualPrice / 100, annualPrice.id, currentPlan.id]
      );
      console.log(`   ✅ Plano anual atualizado`);

      // Inserir plano mensal
      console.log(`   → Inserindo plano mensal...`);
      await connection.query(
        `INSERT INTO subscriptionPlans 
         (name, description, price, currency, stripePriceId, stripeProductId, billingInterval, features, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, 'BRL', ?, ?, 'monthly', ?, 1, NOW(), NOW())`,
        [
          config.displayName,
          currentPlan.description,
          config.monthlyPrice / 100,
          monthlyPrice.id,
          currentPlan.stripeProductId,
          currentPlan.features
        ]
      );
      console.log(`   ✅ Plano mensal inserido\n`);
    }

    console.log('✅ Todos os intervalos de faturamento foram adicionados com sucesso!');
    console.log('\n📊 Resumo:');
    console.log('   Planos Anuais:');
    console.log('   - Essencial: 89 BRL/mês (faturado anualmente)');
    console.log('   - Profissional: 149 BRL/mês (faturado anualmente)');
    console.log('   - Premium: 249 BRL/mês (faturado anualmente)');
    console.log('   - Scale: 399 BRL/mês (faturado anualmente)');
    console.log('\n   Planos Mensais:');
    console.log('   - Essencial: 111 BRL/mês');
    console.log('   - Profissional: 186 BRL/mês');
    console.log('   - Premium: 311 BRL/mês');
    console.log('   - Scale: 498 BRL/mês');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addBillingIntervals();
