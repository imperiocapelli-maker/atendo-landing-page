export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  country: "br" | "ar" | "py";
  image: string;
  videoUrl?: string; // URL do YouTube ou Vimeo
  text: string;
  roi: {
    metric: string;
    before: string;
    after: string;
    percentage: number;
  };
  rating: number; // 1-5 stars
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marina Silva",
    role: "Proprietária",
    company: "Salão Marina Beauty",
    country: "br",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "O Atendo transformou completamente meu salão! Consegui aumentar meus lucros em 45% apenas ajustando a precificação com a ferramenta inteligente. Minha agenda agora está sempre cheia e consigo gerenciar tudo de forma muito mais fácil.",
    roi: {
      metric: "Aumento de Lucro Mensal",
      before: "R$ 8.500",
      after: "R$ 12.325",
      percentage: 45,
    },
    rating: 5,
  },
  {
    id: "2",
    name: "Carlos Rodriguez",
    role: "Dono",
    company: "Clínica Estética Rodriguez",
    country: "ar",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "¡Increíble! Con Atendo ahorro 8 horas por semana en administración. El sistema de precificación inteligente me ayudó a identificar servicios subvaluados. Mis ganancias crecieron un 38% en tres meses.",
    roi: {
      metric: "Aumento de Ganancia Mensual",
      before: "ARS 125.000",
      after: "ARS 172.500",
      percentage: 38,
    },
    rating: 5,
  },
  {
    id: "3",
    name: "Fernanda Costa",
    role: "Gerente",
    company: "Salão & Spa Costa",
    country: "br",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Não consigo mais imaginar meu salão sem o Atendo! A organização da agenda melhorou 100%, e meus clientes adoram a facilidade de agendamento. Meu faturamento subiu 52% em seis meses.",
    roi: {
      metric: "Aumento de Faturamento",
      before: "R$ 15.000",
      after: "R$ 22.800",
      percentage: 52,
    },
    rating: 5,
  },
  {
    id: "4",
    name: "Juan Mendez",
    role: "Proprietário",
    company: "Barbería Premium Mendez",
    country: "py",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "El Atendo es la mejor inversión que hice para mi barbería. Reduje el tiempo de administración en 70% y aumenté mis ganancias en 41%. La precificación inteligente realmente funciona.",
    roi: {
      metric: "Aumento de Ganancia",
      before: "PYG 2.500.000",
      after: "PYG 3.525.000",
      percentage: 41,
    },
    rating: 5,
  },
  {
    id: "5",
    name: "Juliana Santos",
    role: "Proprietária",
    company: "Studio de Pilates Santos",
    country: "br",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Com o Atendo, consegui automatizar processos que antes levavam horas. Meus clientes estão mais satisfeitos com a facilidade de agendamento, e meu lucro aumentou 48%. Recomendo para todos!",
    roi: {
      metric: "Aumento de Lucro",
      before: "R$ 12.000",
      after: "R$ 17.760",
      percentage: 48,
    },
    rating: 5,
  },
  {
    id: "6",
    name: "Patricia Flores",
    role: "Dueña",
    company: "Clínica de Belleza Flores",
    country: "ar",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Atendo cambió mi forma de trabajar. Ahora tengo más tiempo para mis clientes y menos estrés administrativo. Mis ingresos crecieron 35% y la satisfacción de mis clientes también.",
    roi: {
      metric: "Aumento de Ingresos",
      before: "ARS 95.000",
      after: "ARS 128.250",
      percentage: 35,
    },
    rating: 5,
  },
];

// Tradução de labels
export const testimonialLabels = {
  pt: {
    title: "O que Nossos Clientes Dizem",
    subtitle: "Veja como o Atendo transformou negócios de salões e clínicas em toda a América Latina",
    metric: "Métrica",
    before: "Antes",
    after: "Depois",
    increase: "Aumento",
    watchVideo: "Assistir Vídeo",
    readMore: "Ler Mais",
  },
  es: {
    title: "Lo Que Dicen Nuestros Clientes",
    subtitle: "Mira cómo Atendo transformó negocios de salones y clínicas en toda América Latina",
    metric: "Métrica",
    before: "Antes",
    after: "Después",
    increase: "Aumento",
    watchVideo: "Ver Video",
    readMore: "Leer Más",
  },
};
