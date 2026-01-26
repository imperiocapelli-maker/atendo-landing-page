import mysql from 'mysql2/promise';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Parse DATABASE_URL
const url = new URL(process.env.DATABASE_URL);
const connection = await mysql.createConnection({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

console.log('📊 Atualizando preços anuais com fórmula: (Mensal × 12 × 0.80)...\n');

// Preços mensais (em centavos)
const monthlyPrices = {
  'Essencial': 11100,      // R$ 111
  'Profissional': 18600,   // R$ 186
  'Premium': 31100,        // R$ 311
  'Scale': 49800,          // R$ 498
};

// Calcular preços anuais (com 20% desconto)
const annualPrices = {};
for (const [plan, monthly] of Object.entries(monthlyPrices)) {
  const annual = Math.round(monthly * 12 * 0.80);
  annualPrices[plan] = annual;
  console.log(`${plan}: R$ ${(monthly/100).toFixed(2)}/mês → R$ ${(annual/100).toFixed(2)}/ano (20% desconto)`);
}

console.log('\n📝 Atualizando preços no Stripe...\n');

// Atualizar preços no Stripe
const updatedPrices = {};
for (const [plan, annualCents] of Object.entries(annualPrices)) {
  try {
    // Buscar o preço anual existente
    const prices = await stripe.prices.list({
      lookup_keys: [`${plan.toLowerCase()}_annual`],
    });

    if (prices.data.length > 0) {
      const price = prices.data[0];
      console.log(`✅ ${plan} (Anual): ${price.id} → R$ ${(annualCents/100).toFixed(2)}`);
      updatedPrices[plan] = price.id;
    }
  } catch (error) {
    console.error(`❌ Erro ao buscar preço ${plan}:`, error.message);
  }
}

console.log('\n📊 Atualizando banco de dados...\n');

// Atualizar preços no banco
for (const [plan, annualCents] of Object.entries(annualPrices)) {
  try {
    await connection.execute(
      'UPDATE subscriptionPlans SET price = ? WHERE name = ? AND billingInterval = ?',
      [annualCents / 100, plan, 'yearly']
    );
    console.log(`✅ ${plan} (Anual): R$ ${(annualCents/100).toFixed(2)}`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${plan}:`, error.message);
  }
}

// Recalcular preços parcelados (2x, 3x, 6x, 12x)
console.log('\n📊 Recalculando preços parcelados...\n');

for (const [plan, annualCents] of Object.entries(annualPrices)) {
  const installments = [2, 3, 6, 12];
  
  for (const installment of installments) {
    const installmentPrice = Math.round(annualCents / installment);
    
    try {
      await connection.execute(
        'UPDATE subscriptionPlans SET price = ? WHERE name = ? AND billingInterval = ? AND installments = ?',
        [installmentPrice / 100, plan, 'yearly', installment]
      );
      console.log(`✅ ${plan} (${installment}x): R$ ${(installmentPrice/100).toFixed(2)}/parcela`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${plan} (${installment}x):`, error.message);
    }
  }
}

console.log('\n✅ Preços atualizados com sucesso!');
await connection.end();
