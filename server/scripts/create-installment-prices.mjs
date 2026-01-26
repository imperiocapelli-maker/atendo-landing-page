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

const annualPrices = {
  'Essencial': { price: 1332, productId: null },
  'Profissional': { price: 2232, productId: null },
  'Premium': { price: 3732, productId: null },
  'Scale': { price: 5976, productId: null }
};

const installmentOptions = [2, 3, 6, 12];

async function createInstallmentPrices() {
  let connection;
  
  try {
    console.log('🚀 Iniciando criação de preços parcelados...\n');
    
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connection = await createConnection({
      ...dbConfig,
      ssl: { rejectUnauthorized: false }
    });
    
    // Buscar product IDs dos planos anuais
    for (const planName of Object.keys(annualPrices)) {
      const [plans] = await connection.query(`
        SELECT DISTINCT stripeProductId 
        FROM subscriptionPlans 
        WHERE name = ? AND billingInterval = 'yearly'
      `, [planName]);
      
      if (plans.length > 0) {
        annualPrices[planName].productId = plans[0].stripeProductId;
        console.log(`✓ ${planName}: Product ID = ${plans[0].stripeProductId}`);
      }
    }
    
    console.log('\n');
    
    // Criar preços parcelados
    for (const [planName, { price, productId }] of Object.entries(annualPrices)) {
      if (!productId) {
        console.log(`⚠️  ${planName}: Produto não encontrado, pulando...`);
        continue;
      }
      
      console.log(`📋 Processando ${planName} (R$ ${price}/ano)`);
      
      for (const installments of installmentOptions) {
        const pricePerInstallment = Math.round(price / installments);
        
        try {
          const stripePrice = await stripe.prices.create({
            product: productId,
            unit_amount: pricePerInstallment * 100,
            currency: 'brl',
            metadata: {
              installments: installments.toString(),
              total_amount: price.toString(),
              plan_name: planName
            }
          });
          
          // Inserir no banco
          await connection.query(`
            INSERT INTO subscriptionPlans 
            (name, description, price, currency, stripePriceId, stripeProductId, billingInterval, installments, features, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            `${planName} - ${installments}x`,
            `${planName} parcelado em ${installments}x sem juros`,
            pricePerInstallment.toString(),
            'BRL',
            stripePrice.id,
            productId,
            'yearly',
            installments,
            '[]',
            1
          ]);
          
          console.log(`   ✅ ${installments}x de R$ ${pricePerInstallment} - ${stripePrice.id}`);
        } catch (error) {
          console.log(`   ❌ Erro ao criar ${installments}x: ${error.message}`);
        }
      }
      console.log('');
    }
    
    console.log('✅ Preços parcelados criados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createInstallmentPrices();
