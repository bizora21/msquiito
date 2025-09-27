"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

type Message = { from: "user" | "bot"; text: string };

const WA_LINK = "https://wa.me/258863181415";

const SUGGESTIONS = [
  "Prazo de entrega",
  "Formas de pagamento",
  "Como virar vendedor",
  "Taxa de entrega",
  "Como acompanhar pedido",
  "Serviços em domicílio",
];

const KNOWLEDGE: { patterns: string[]; answer: string }[] = [
  {
    patterns: ["prazo", "entrega", "tempo", "quando chega"],
    answer:
      "Entregamos em até 24h nas principais cidades, e em outros locais conforme o raio de atendimento do vendedor/prestador.",
  },
  {
    patterns: ["pagamento", "formas", "pagar", "cartao", "carteira", "mpesa"],
    answer:
      "Trabalhamos com Pagamento na Entrega (Cash on Delivery). Em breve adicionaremos carteira móvel e cartão.",
  },
  {
    patterns: ["vendedor", "vender", "loja", "cadastrar produto"],
    answer:
      "Para ser vendedor, acesse 'Torne-se Vendedor', conclua o cadastro e use o Dashboard para cadastrar e gerir produtos.",
  },
  {
    patterns: ["taxa", "frete", "entrega custo", "custo entrega"],
    answer:
      "A taxa de entrega é definida pelo vendedor/prestador e aparece no checkout; em campanhas, pode haver frete grátis.",
  },
  {
    patterns: ["acompanhar", "rastreio", "tracking", "status", "pedido"],
    answer:
      "Você recebe atualizações por WhatsApp/SMS e pode ver o status em Minha Conta (Dashboard do Cliente).",
  },
  {
    patterns: ["servico", "domicilio", "instalacao", "montagem", "tecnico"],
    answer:
      "Prestadores atendem em domicílio conforme disponibilidade e raio definido. Solicite na página do serviço.",
  },
  {
    patterns: ["cancelar", "devolver", "troca", "reembolso"],
    answer:
      "Cancelamentos são possíveis enquanto o pedido estiver pendente. Para trocas/devoluções, fale com nosso suporte via WhatsApp.",
  },
  {
    patterns: ["suporte", "ajuda", "contato", "whatsapp"],
    answer:
      `Para falar com um humano rapidamente, use nosso WhatsApp oficial: ${WA_LINK}`,
  },
];

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export default function ChatBot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      from: "bot",
      text: "Olá! Sou o assistente da LojaRápida. Posso ajudar com entregas, pagamentos, vendedores e serviços.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const reply = (q: string) => {
    const n = normalize(q);
    const hit = KNOWLEDGE.find((k) => k.patterns.some((p) => n.includes(normalize(p))));
    const base =
      hit?.answer ||
      "Não encontrei uma resposta direta. Você pode tentar reformular ou falar com um humano pelo WhatsApp.";
    const extra = hit ? "" : `\n\nAtendimento humano: ${WA_LINK}`;
    setMessages((prev) => [...prev, { from: "user", text: q }, { from: "bot", text: base + extra }]);
    setInput("");
    setTimeout(() => {
      viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
    }, 10);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    reply(input.trim());
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 p-0">
              <MessageCircle size={22} className="mx-auto" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Assistente LojaRápida</SheetTitle>
              <p className="text-xs text-slate-500">Respostas rápidas e ajuda para sua compra</p>
            </SheetHeader>

            <div className="px-4 mt-3">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="cursor-pointer hover:bg-slate-200"
                    onClick={() => reply(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-3 border-t" />

            <ScrollArea className="flex-1 px-4 py-3">
              <div ref={viewportRef as any}>
                <div className="space-y-3">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm
                          ${m.from === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <form onSubmit={onSubmit} className="p-4 border-t flex items-center gap-2">
              <Input
                placeholder="Digite sua dúvida..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit">Enviar</Button>
            </form>

            <div className="px-4 pb-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-green-600 hover:underline"
              >
                Precisa de um humano? Falar no WhatsApp
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}