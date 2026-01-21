import Stripe from "stripe";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const dbConfig = {
  host: process.env.DATABASE_URL?.split("@")[1]?.split(":")[0] || "localhost",
  user: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "root",
  password: process.env.DATABASE_URL?.split(":")[1]?.split("@")[0] || "",
  database: process.env.DATABASE_URL?.split("/").pop() || "atendo",
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const plans = [
  {
    name: "Básico",
    description: "Perfeito para começar",
    price: 99.99,
    features: [
      "Até 10 clientes",
      "Agendamentos básicos",
      "Relatórios simples",
      "Suporte por email",
    ],
  },
  {
    name: "Profissional",
    description: "Mais popular",
    price: 199.99,
    features: [
      "Até 100 clientes",
      "Agendamentos avançados",
      "Relatórios detalhados",
      "Precificação inteligente",
      "Suporte prioritário",
      "Integrações",
    ],
  },
  {
    name: "Enterprise",
    description: "Para grandes operações",
    price: 499.99,
    features: [
      "Clientes ilimitados",
      "Todas as funcionalidades",
      "API customizada",
      "Suporte 24/7",
      "Gerenciador dedicado",
      "Integrações ilimitadas",
    ],
  },
];

async function seedPlans() {
  console.log("🚀 Iniciando seed de planos de assinatura...\n");

  try {
    // Conectar ao banco de dados
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado ao banco de dados\n");

    for (const plan of plans) {
      console.log(`📦 Criando plano: ${plan.name}`);

      // Verificar se o plano já existe
      const [existingPlans] = await connection.execute(
        "SELECT id FROM subscription_plans WHERE name = ?",
        [plan.name]
      );

      if (existingPlans.length > 0) {
        console.log(`   ⏭️  Plano ${plan.name} já existe, pulando...\n`);
        continue;
      }

      // Criar produto no Stripe
      console.log(`   → Criando produto no Stripe...`);
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_name: plan.name,
        },
      });
      console.log(`   ✅ Produto criado: ${product.id}`);

      // Criar preço no Stripe
      console.log(`   → Criando preço no Stripe...`);
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(plan.price * 100), // Converter para centavos
        currency: "brl",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
        metadata: {
          plan_name: plan.name,
        },
      });
      console.log(`   ✅ Preço criado: ${price.id}`);

      // Inserir plano no banco de dados
      console.log(`   → Inserindo plano no banco de dados...`);
      await connection.execute(
        `INSERT INTO subscription_plans 
        (name, description, price, stripePriceId, stripeProductId, billingInterval, features, isActive) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plan.name,
          plan.description,
          plan.price,
          price.id,
          product.id,
          "monthly",
          JSON.stringify(plan.features),
          1,
        ]
      );
      console.log(`   ✅ Plano inserido no banco de dados\n`);
    }

    // Verificar planos criados
    const [allPlans] = await connection.execute(
      "SELECT id, name, price FROM subscription_plans WHERE isActive = 1"
    );
    console.log("\n📊 Planos criados com sucesso:");
    console.table(allPlans);

    await connection.end();
    console.log("\n✅ Seed concluído com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante seed:", error);
    process.exit(1);
  }
}

seedPlans();
