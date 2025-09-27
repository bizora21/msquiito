export type Article = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

export const articles: Article[] = [
  {
    slug: "como-gerenciar-seu-negocio",
    title: "Como gerenciar seu negócio local com eficiência",
    date: "2025-09-01",
    excerpt: "Dicas práticas para você otimizar processos e aumentar vendas em sua loja local.",
    content: `<p>Gerenciar um negócio local requer atenção em estoque, atendimento e marketing. Primeiro, mantenha um inventário organizado...</p><p>Use ferramentas digitais para controlar vendas e estoque em tempo real. Comunique-se com seus clientes via WhatsApp e redes sociais...</p>`,
  },
  {
    slug: "estrategias-marketing-digital",
    title: "Estratégias de marketing digital para pequenos varejistas",
    date: "2025-08-20",
    excerpt: "Aprenda a atrair mais clientes online usando redes sociais e anúncios segmentados.",
    content: `<p>O marketing digital é acessível mesmo para negócios de pequeno porte. Comece definindo seu público-alvo...</p><p>Invista em publicações regulares no Facebook e Instagram, com promoções e depoimentos de clientes...</p>`,
  },
];

export function getArticleBySlug(slug?: string): Article | undefined {
  if (!slug) return undefined;
  return articles.find((a) => a.slug === slug);
}