export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  rating?: number;
  category?: string;
  description?: string;
};

export type Service = {
  id: string;
  name: string;
  priceFrom?: number;
  image?: string;
  rating?: number;
  description?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Smartphone Básico",
    price: 8999,
    image: "/placeholder.svg",
    rating: 4.3,
    category: "Eletrónica",
    description:
      "Smartphone económico com bateria de longa duração, ideal para chamadas e redes sociais.",
  },
  {
    id: "p2",
    name: "Geladeira Compacta",
    price: 27999,
    image: "/placeholder.svg",
    rating: 4.6,
    category: "Eletrodomésticos",
    description: "Geladeira compacta, eficiente e com baixo consumo de energia.",
  },
  {
    id: "p3",
    name: "Bicicleta Urbana",
    price: 12999,
    image: "/placeholder.svg",
    rating: 4.4,
    category: "Transportes",
    description: "Bicicleta leve ideal para deslocações na cidade.",
  },
  {
    id: "p4",
    name: "Cafeteira Elétrica",
    price: 3999,
    image: "/placeholder.svg",
    rating: 4.2,
    category: "Casa",
    description: "Cafeteira prática para o seu café diário.",
  },
  {
    id: "p5",
    name: "Televisão 32\" LED",
    price: 19999,
    image: "/placeholder.svg",
    rating: 4.5,
    category: "Eletrónica",
    description: "Televisão com boa qualidade de imagem e baixo consumo.",
  },
  {
    id: "p6",
    name: "Máscara e Kit Higiene",
    price: 799,
    image: "/placeholder.svg",
    rating: 4.1,
    category: "Saúde",
    description: "Kit essencial para proteção e higiene pessoal.",
  },
];

export const services: Service[] = [
  {
    id: "s1",
    name: "Entrega Rápida",
    priceFrom: 199,
    image: "/placeholder.svg",
    rating: 4.8,
    description: "Entrega em até 24h nas principais cidades de Moçambique.",
  },
  {
    id: "s2",
    name: "Instalação e Montagem",
    priceFrom: 499,
    image: "/placeholder.svg",
    rating: 4.5,
    description: "Serviço profissional de instalação de eletrodomésticos e móveis.",
  },
  {
    id: "s3",
    name: "Suporte Técnico",
    priceFrom: 299,
    image: "/placeholder.svg",
    rating: 4.4,
    description: "Assistência técnica para equipamentos eletrônicos.",
  },
];

export function getProductById(id?: string) {
  if (!id) return undefined;
  return products.find((p) => p.id === id);
}

export function getServiceById(id?: string) {
  if (!id) return undefined;
  return services.find((s) => s.id === id);
}