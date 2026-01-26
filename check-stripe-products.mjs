import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkProducts() {
  try {
    const products = await stripe.products.list({ limit: 20 });
    console.log('Produtos no Stripe:\n');
    products.data.forEach(p => {
      console.log(`Nome: ${p.name}`);
      console.log(`ID: ${p.id}\n`);
    });
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkProducts();
