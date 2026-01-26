import { createConnection } from 'mysql2/promise';
import { URL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

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

async function checkPlans() {
  let connection;
  try {
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connection = await createConnection({
      ...dbConfig,
      ssl: { rejectUnauthorized: false },
    });

    const [plans] = await connection.query('SELECT id, name, price, billingInterval, stripePriceId FROM subscriptionPlans ORDER BY name, billingInterval');
    
    console.log('Planos no banco de dados:\n');
    plans.forEach(p => {
      console.log(`${p.name} (${p.billingInterval}): R$ ${p.price} - ${p.stripePriceId}`);
    });

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkPlans();
