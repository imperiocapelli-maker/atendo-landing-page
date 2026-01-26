import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const url = new URL(dbUrl);
const config = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: 'amazon',
};

const conn = await mysql.createConnection(config);
const [rows] = await conn.execute('SELECT id, name, price, billingInterval, installments, stripePriceId FROM subscriptionPlans ORDER BY name, billingInterval, installments');
console.log('Planos no banco:');
rows.forEach(row => {
  console.log(`  ${row.name} - ${row.billingInterval} - ${row.installments || 'null'} - R$ ${row.price} - ${row.stripePriceId}`);
});
await conn.end();
