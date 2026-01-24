import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

async function createScalePlan() {
  console.log("🚀 Criando plano Scale no Stripe...\n");

  try {
    // Criar produto no Stripe
    console.log("📦 Criando produto no Stripe...");
    const product = await stripe.products.create({
      name: "Scale",
      description: "Para empresas em crescimento",
      metadata: {
        plan_name: "Scale",
      },
    });
    console.log(`✅ Produto criado: ${product.id}\n`);

    // Criar preço no Stripe
    console.log("💰 Criando preço no Stripe...");
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 39999, // R$ 399,99 em centavos
      currency: "brl",
      recurring: {
        interval: "month",
        interval_count: 1,
      },
      metadata: {
        plan_name: "Scale",
      },
    });
    console.log(`✅ Preço criado: ${price.id}\n`);

    console.log("📋 Informações do Plano Scale:");
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Preço: R$ 399,99/mês\n`);

    console.log("✅ Plano Scale criado com sucesso!");
    console.log("\n📝 Use estes IDs para atualizar o banco de dados:");
    console.log(`   INSERT INTO subscriptionPlans (name, description, price, stripePriceId, stripeProductId, billingInterval, features, isActive)`);
    console.log(`   VALUES ('Scale', 'Para empresas em crescimento', 399.99, '${price.id}', '${product.id}', 'monthly', '[\"Tudo do Premium\", \"API Customizada\", \"Integrações Ilimitadas\", \"Suporte Dedicado\", \"Treinamento Personalizado\"]', 1);`);

  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

createScalePlan();
