export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "geral" | "impostos" | "suporte" | "conformidade" | "integracao";
}

export interface CountryFAQ {
  country: string;
  countryCode: string;
  language: string;
  currency: string;
  faqs: FAQItem[];
}

export const faqData: Record<string, CountryFAQ> = {
  br: {
    country: "Brasil",
    countryCode: "BR",
    language: "pt",
    currency: "BRL",
    faqs: [
      {
        id: "br-1",
        category: "geral",
        question: "O Atendo funciona para salões e clínicas?",
        answer:
          "Sim! O Atendo foi desenvolvido especificamente para salões de beleza, clínicas estéticas, clínicas odontológicas e outros negócios de serviços. Funciona perfeitamente para ambos os tipos de negócio.",
      },
      {
        id: "br-2",
        category: "geral",
        question: "Posso testar o Atendo gratuitamente?",
        answer:
          "Sim! Oferecemos uma demonstração gratuita onde você pode explorar todas as funcionalidades. Agende uma demo com nosso especialista e ele mostrará como o Atendo pode transformar seu negócio.",
      },
      {
        id: "br-3",
        category: "geral",
        question: "Quanto tempo leva para começar a usar?",
        answer:
          "Você pode começar em menos de 24 horas! Após o cadastro, nossa equipe de onboarding ajuda na configuração inicial. A maioria dos clientes está operacional em 1-2 dias.",
      },
      {
        id: "br-4",
        category: "impostos",
        question: "Como funciona a emissão de recibos e notas fiscais?",
        answer:
          "O Atendo integra-se com sistemas de NF-e e gera recibos automáticos. Para negócios que precisam de nota fiscal, recomendamos integração com softwares como Bluesoft ou Nuvem Fiscal. Nosso suporte pode ajudar nessa configuração.",
      },
      {
        id: "br-5",
        category: "impostos",
        question: "O Atendo ajuda com cálculo de impostos?",
        answer:
          "O Atendo registra todas as transações com precisão, facilitando o cálculo de impostos. Para ISS (Imposto sobre Serviços), você terá relatórios detalhados por serviço. Recomendamos consultar seu contador para conformidade total.",
      },
      {
        id: "br-6",
        category: "impostos",
        question: "Preciso de MEI ou PJ para usar o Atendo?",
        answer:
          "Não é obrigatório, mas recomendado para formalizar seu negócio. O Atendo funciona tanto para autônomos quanto para empresas formalizadas. Consulte um contador para definir a melhor estrutura para seu caso.",
      },
      {
        id: "br-7",
        category: "suporte",
        question: "Qual é o horário de atendimento do suporte?",
        answer:
          "Nosso suporte está disponível de segunda a sexta, das 9h às 18h (horário de Brasília). Para emergências fora desse horário, temos um sistema de tickets que é respondido no próximo dia útil.",
      },
      {
        id: "br-8",
        category: "suporte",
        question: "Como entro em contato com o suporte?",
        answer:
          "Você pode entrar em contato via WhatsApp, email ou chat dentro da plataforma. Todos os canais estão disponíveis no painel do Atendo. Tempo médio de resposta: 2 horas.",
      },
      {
        id: "br-9",
        category: "suporte",
        question: "Vocês oferecem treinamento para minha equipe?",
        answer:
          "Sim! Oferecemos treinamento online gratuito para sua equipe. Você pode agendar sessões de 1-2 horas onde ensinamos como usar todas as funcionalidades. Clientes Premium têm acesso a treinamento ilimitado.",
      },
      {
        id: "br-10",
        category: "conformidade",
        question: "O Atendo está em conformidade com a LGPD?",
        answer:
          "Sim! O Atendo está 100% em conformidade com a Lei Geral de Proteção de Dados (LGPD). Todos os dados dos clientes são criptografados e armazenados em servidores seguros no Brasil. Você pode solicitar nossa documentação de conformidade.",
      },
      {
        id: "br-11",
        category: "conformidade",
        question: "Meus dados estão seguros?",
        answer:
          "Absolutamente! Usamos criptografia de nível bancário, backups automáticos diários e servidores redundantes. Seus dados estão armazenados em data centers certificados ISO 27001 no Brasil.",
      },
      {
        id: "br-12",
        category: "integracao",
        question: "O Atendo integra com WhatsApp?",
        answer:
          "Sim! Você pode enviar confirmações de agendamento, lembretes e promoções via WhatsApp. A integração é automática e não requer configuração técnica complexa.",
      },
    ],
  },
  ar: {
    country: "Argentina",
    countryCode: "AR",
    language: "es",
    currency: "ARS",
    faqs: [
      {
        id: "ar-1",
        category: "geral",
        question: "¿Atendo funciona para salones y clínicas en Argentina?",
        answer:
          "¡Por supuesto! Atendo fue desarrollado específicamente para salones de belleza, clínicas estéticas, clínicas odontológicas y otros negocios de servicios. Funciona perfectamente para ambos tipos de negocio en Argentina.",
      },
      {
        id: "ar-2",
        category: "geral",
        question: "¿Puedo probar Atendo gratis?",
        answer:
          "¡Sí! Ofrecemos una demostración gratuita donde puedes explorar todas las funcionalidades. Agenda una demo con nuestro especialista y te mostrará cómo Atendo puede transformar tu negocio.",
      },
      {
        id: "ar-3",
        category: "geral",
        question: "¿Cuánto tiempo tarda en comenzar a usar?",
        answer:
          "¡Puedes comenzar en menos de 24 horas! Después del registro, nuestro equipo de onboarding te ayuda con la configuración inicial. La mayoría de los clientes están operativos en 1-2 días.",
      },
      {
        id: "ar-4",
        category: "impostos",
        question: "¿Cómo funciona la emisión de facturas y recibos?",
        answer:
          "Atendo se integra con sistemas de facturación electrónica (AFIP). Genera recibos automáticos y puede conectarse con softwares como Factura Plus o Billing. Nuestro soporte puede ayudarte con esta configuración.",
      },
      {
        id: "ar-5",
        category: "impostos",
        question: "¿Atendo ayuda con el cálculo de impuestos?",
        answer:
          "Atendo registra todas las transacciones con precisión, facilitando el cálculo de impuestos. Para IVA (21% estándar en Argentina), tendrás reportes detallados por servicio. Recomendamos consultar con tu contador para cumplimiento total.",
      },
      {
        id: "ar-6",
        category: "impostos",
        question: "¿Necesito monotributo o responsable inscripto para usar Atendo?",
        answer:
          "No es obligatorio, pero recomendado para formalizar tu negocio. Atendo funciona tanto para trabajadores independientes como para empresas formalizadas. Consulta con un contador para definir la mejor estructura para tu caso.",
      },
      {
        id: "ar-7",
        category: "suporte",
        question: "¿Cuál es el horario de atención del soporte?",
        answer:
          "Nuestro soporte está disponible de lunes a viernes, de 9 a 18 horas (hora de Buenos Aires). Para emergencias fuera de este horario, tenemos un sistema de tickets que se responde el próximo día hábil.",
      },
      {
        id: "ar-8",
        category: "suporte",
        question: "¿Cómo contacto al soporte?",
        answer:
          "Puedes contactarnos vía WhatsApp, email o chat dentro de la plataforma. Todos los canales están disponibles en el panel de Atendo. Tiempo promedio de respuesta: 2 horas.",
      },
      {
        id: "ar-9",
        category: "suporte",
        question: "¿Ofrecen capacitación para mi equipo?",
        answer:
          "¡Sí! Ofrecemos capacitación online gratuita para tu equipo. Puedes agendar sesiones de 1-2 horas donde enseñamos cómo usar todas las funcionalidades. Los clientes Premium tienen acceso a capacitación ilimitada.",
      },
      {
        id: "ar-10",
        category: "conformidade",
        question: "¿Atendo cumple con la Ley de Protección de Datos Personales?",
        answer:
          "¡Sí! Atendo cumple 100% con la Ley de Protección de Datos Personales de Argentina. Todos los datos de clientes están encriptados y almacenados en servidores seguros. Puedes solicitar nuestra documentación de cumplimiento.",
      },
      {
        id: "ar-11",
        category: "conformidade",
        question: "¿Mis datos están seguros?",
        answer:
          "¡Absolutamente! Usamos encriptación de nivel bancario, copias de seguridad automáticas diarias y servidores redundantes. Tus datos se almacenan en centros de datos certificados ISO 27001.",
      },
      {
        id: "ar-12",
        category: "integracao",
        question: "¿Atendo se integra con WhatsApp?",
        answer:
          "¡Sí! Puedes enviar confirmaciones de citas, recordatorios y promociones vía WhatsApp. La integración es automática y no requiere configuración técnica compleja.",
      },
    ],
  },
  py: {
    country: "Paraguay",
    countryCode: "PY",
    language: "es",
    currency: "PYG",
    faqs: [
      {
        id: "py-1",
        category: "geral",
        question: "¿Atendo funciona para salones y clínicas en Paraguay?",
        answer:
          "¡Por supuesto! Atendo fue desarrollado específicamente para salones de belleza, clínicas estéticas, clínicas odontológicas y otros negocios de servicios. Funciona perfectamente para ambos tipos de negocio en Paraguay.",
      },
      {
        id: "py-2",
        category: "geral",
        question: "¿Puedo probar Atendo gratis?",
        answer:
          "¡Sí! Ofrecemos una demostración gratuita donde puedes explorar todas las funcionalidades. Agenda una demo con nuestro especialista y te mostrará cómo Atendo puede transformar tu negocio.",
      },
      {
        id: "py-3",
        category: "geral",
        question: "¿Cuánto tiempo tarda en comenzar a usar?",
        answer:
          "¡Puedes comenzar en menos de 24 horas! Después del registro, nuestro equipo de onboarding te ayuda con la configuración inicial. La mayoría de los clientes están operativos en 1-2 días.",
      },
      {
        id: "py-4",
        category: "impostos",
        question: "¿Cómo funciona la emisión de facturas y recibos?",
        answer:
          "Atendo genera recibos automáticos que cumplen con los requisitos de la DGGR (Dirección General de Gestión Registral). Para facturación electrónica, recomendamos integración con softwares certificados. Nuestro soporte puede ayudarte.",
      },
      {
        id: "py-5",
        category: "impostos",
        question: "¿Atendo ayuda con el cálculo de impuestos?",
        answer:
          "Atendo registra todas las transacciones con precisión, facilitando el cálculo de impuestos. Para IVA (10% estándar en Paraguay), tendrás reportes detallados por servicio. Recomendamos consultar con tu contador para cumplimiento total.",
      },
      {
        id: "py-6",
        category: "impostos",
        question: "¿Necesito estar registrado en la SET para usar Atendo?",
        answer:
          "No es obligatorio para comenzar, pero es recomendado para formalizar tu negocio. Atendo funciona tanto para trabajadores independientes como para empresas registradas en la SET. Consulta con un contador para la mejor estructura.",
      },
      {
        id: "py-7",
        category: "suporte",
        question: "¿Cuál es el horario de atención del soporte?",
        answer:
          "Nuestro soporte está disponible de lunes a viernes, de 9 a 18 horas (hora de Asunción). Para emergencias fuera de este horario, tenemos un sistema de tickets que se responde el próximo día hábil.",
      },
      {
        id: "py-8",
        category: "suporte",
        question: "¿Cómo contacto al soporte?",
        answer:
          "Puedes contactarnos vía WhatsApp, email o chat dentro de la plataforma. Todos los canales están disponibles en el panel de Atendo. Tiempo promedio de respuesta: 2 horas.",
      },
      {
        id: "py-9",
        category: "suporte",
        question: "¿Ofrecen capacitación para mi equipo?",
        answer:
          "¡Sí! Ofrecemos capacitación online gratuita para tu equipo. Puedes agendar sesiones de 1-2 horas donde enseñamos cómo usar todas las funcionalidades. Los clientes Premium tienen acceso a capacitación ilimitada.",
      },
      {
        id: "py-10",
        category: "conformidade",
        question: "¿Atendo cumple con la Ley de Protección de Datos?",
        answer:
          "¡Sí! Atendo cumple con la Ley de Protección de Datos Personales de Paraguay. Todos los datos de clientes están encriptados y almacenados en servidores seguros. Puedes solicitar nuestra documentación de cumplimiento.",
      },
      {
        id: "py-11",
        category: "conformidade",
        question: "¿Mis datos están seguros?",
        answer:
          "¡Absolutamente! Usamos encriptación de nivel bancario, copias de seguridad automáticas diarias y servidores redundantes. Tus datos se almacenan en centros de datos certificados ISO 27001.",
      },
      {
        id: "py-12",
        category: "integracao",
        question: "¿Atendo se integra con WhatsApp?",
        answer:
          "¡Sí! Puedes enviar confirmaciones de citas, recordatorios y promociones vía WhatsApp. La integración es automática y no requiere configuración técnica compleja.",
      },
    ],
  },
};

export function getFAQByCountry(countryCode: string): CountryFAQ {
  const code = countryCode.toLowerCase();
  return faqData[code] || faqData.br;
}

export function getFAQsByCategory(
  countryCode: string,
  category: FAQItem["category"]
): FAQItem[] {
  const countryFAQ = getFAQByCountry(countryCode);
  return countryFAQ.faqs.filter((faq) => faq.category === category);
}

export function getAllFAQCategories(): FAQItem["category"][] {
  return ["geral", "impostos", "suporte", "conformidade", "integracao"];
}
