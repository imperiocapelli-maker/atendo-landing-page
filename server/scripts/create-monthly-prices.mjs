import Stripe from 'stripe';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Parse DATABASE_URL
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

// Dados dos planos mensais
const monthlyPlans = [
  {
    name: "Essencial",
    price: 11100, // 111 BRL em centavos
    productId: null,
    billingInterval: "monthly",
  },
  {
    name: "Profissional",
    price: 18600, // 186 BRL em centavos
    productId: null,
    billingInterval: "monthly",
  },
  {
    name: "Premium",
    price: 31100, // 311 BRL em centavos
    productId: null,
    billingInterval: "monthly",
  },
  {
    name: "Scale",
    price: 49800, // 498 BRL em centavos
    productId: null,
    billingInterval: "monthly",
  },
];

async function createMonthlyPrices() {
  let connection;
  try {
    console.log('🚀 Iniciando criação de preços mensais...\n');

    // Conectar ao banco de dados
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    console.log(`📡 Conectando ao banco: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    connection = await createConnection({
      ...dbConfig,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log('✅ Conectado ao banco de dados\n');

    // Para cada plano, obter o productId do banco
    for (const plan of monthlyPlans) {
      console.log(`📋 Processando plano: ${plan.name}`);
      
      // Buscar o produto no banco
      const [rows] = await connection.query(
        'SELECT stripeProductId FROM subscriptionPlans WHERE name = ? AND billingInterval = ?',
        [plan.name, 'yearly']
      );

      if (rows.length === 0) {
        console.log(`   ⚠️  Plano anual não encontrado no banco, pulando...\n`);
        continue;
      }

      plan.productId = rows[0].stripeProductId;
      console.log(`   ✅ Product ID encontrado: ${plan.productId}`);

      // Criar preço mensal no Stripe
      console.log(`   → Criando preço mensal no Stripe...`);
      const price = await stripe.prices.create({
        unit_amount: plan.price,
        currency: 'brl',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        product: plan.productId,
        billing_scheme: 'per_unit',
        metadata: {
          plan: plan.name.toLowerCase(),
          billing: 'monthly'
        }
      });
      console.log(`   ✅ Preço criado: ${price.id}`);

      // Inserir no banco de dados
      console.log(`   → Inserindo no banco de dados...`);
      const [yearlyPlan] = await connection.query(
        'SELECT description, features FROM subscriptionPlans WHERE name = ? AND billingInterval = ? LIMIT 1',
        [plan.name, 'yearly']
      );

      if (yearlyPlan.length > 0) {
        await connection.query(
          `INSERT INTO subscriptionPlans 
           (name, description, price, currency, stripePriceId, stripeProductId, billingInterval, features, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, 'BRL', ?, ?, 'monthly', ?, 1, NOW(), NOW())`,
          [
            plan.name,
            yearlyPlan[0].description,
            plan.price / 100,
            price.id,
            plan.productId,
            yearlyPlan[0].features
          ]
        );
        console.log(`   ✅ Inserido no banco\n`);
      }
    }

    console.log('✅ Todos os preços mensais foram criados com sucesso!');
    console.log('\n📊 Resumo:');
    console.log('   - Essencial Mensal: 111 BRL');
    console.log('   - Profissional Mensal: 186 BRL');
    console.log('   - Premium Mensal: 311 BRL');
    console.log('   - Scale Mensal: 498 BRL');

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

createMonthlyPrices();
