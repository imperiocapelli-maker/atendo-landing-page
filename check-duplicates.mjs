import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: 'root',
  password: process.env.DATABASE_URL?.split(':')[1]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'atendo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDuplicates() {
  const connection = await pool.getConnection();
  try {
    const [allInstallments] = await connection.query(`
      SELECT id, name, billingInterval, installments, price, stripePriceId
      FROM subscriptionPlans
      WHERE installments > 1
      ORDER BY name, installments
    `);
    
    console.log('Todos os planos parcelados:');
    console.log(allInstallments);
  } finally {
    connection.release();
  }
}

checkDuplicates().catch(console.error).finally(() => process.exit());
