import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('//')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'atendo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

const newAnnualPrices = {
  'Essencial': 1332,
  'Profissional': 2232,
  'Premium': 3732,
  'Scale': 5976
};

async function updatePrices() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Atualizando preços anuais...');
    
    for (const [planName, newPrice] of Object.entries(newAnnualPrices)) {
      const query = `
        UPDATE subscription_plans 
        SET price = ? 
        WHERE name = ? AND billing_interval = 'yearly' AND is_active = 1
      `;
      
      const [result] = await connection.execute(query, [newPrice.toString(), planName]);
      console.log(`✓ ${planName} (Anual): R$ ${newPrice} - ${result.affectedRows} registros atualizados`);
    }
    
    // Verificar preços atualizados
    const [plans] = await connection.execute(`
      SELECT name, billing_interval, price 
      FROM subscription_plans 
      WHERE is_active = 1 
      ORDER BY name, billing_interval
    `);
    
    console.log('\n📊 Preços Atualizados:');
    plans.forEach(plan => {
      console.log(`${plan.name} (${plan.billing_interval}): R$ ${plan.price}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar preços:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

updatePrices();
