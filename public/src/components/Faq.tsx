"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Faq() {
  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Perguntas Frequentes</h2>
            <p className="text-sm text-slate-600 mt-1">
              Dúvidas comuns sobre compras, entregas, vendedores e prestadores.
            </p>
          </div>
          <Link to="/vendedor/register">
            <Button variant="outline" className="hidden sm:inline-flex">Sou vendedor</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Compras e Pagamentos</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="pay-1">
                <AccordionTrigger>Quais são as formas de pagamento?</AccordionTrigger>
                <AccordionContent>
                  Priorizamos Pagamento na Entrega (Cash on Delivery). Em breve, adicionaremos carteira móvel e cartão. Confirme os detalhes com o entregador no momento da entrega.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pay-2">
                <AccordionTrigger>Posso cancelar um pedido?</AccordionTrigger>
                <AccordionContent>
                  Sim, enquanto o pedido estiver “pendente” ou “em preparação”. Se já estiver “em rota”, entre em contacto pelo WhatsApp para suporte.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pay-3">
                <AccordionTrigger>Como acompanho meu pedido?</AccordionTrigger>
                <AccordionContent>
                  Após confirmar, enviamos atualizações por WhatsApp/SMS. Você também verá o status no painel do cliente (Minha Conta).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Entregas</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ship-1">
                <AccordionTrigger>Qual o prazo de entrega?</AccordionTrigger>
                <AccordionContent>
                  Para capitais e principais cidades: até 24h em horário comercial. Outras regiões variam conforme o raio de atendimento do vendedor/prestador.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship-2">
                <AccordionTrigger>Existe taxa de entrega?</AccordionTrigger>
                <AccordionContent>
                  Sim, a taxa é definida pelo vendedor/prestador e informada no checkout. Em campanhas, pode haver frete grátis promocional.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship-3">
                <AccordionTrigger>E se eu não estiver em casa?</AccordionTrigger>
                <AccordionContent>
                  O entregador tentará novo contato. Se não for possível, reagendamos pelo WhatsApp e mantemos o pedido em espera por 24 horas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Para Vendedores</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="seller-1">
                <AccordionTrigger>Como me torno vendedor?</AccordionTrigger>
                <AccordionContent>
                  Registe-se na página “Torne-se Vendedor”. Após a validação básica, aceda ao seu dashboard para cadastrar produtos, gerir preços e estoque.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="seller-2">
                <AccordionTrigger>Como cadastro produtos?</AccordionTrigger>
                <AccordionContent>
                  No Dashboard do Vendedor, use “Novo Produto” para inserir nome, preço, imagem e descrição. Pode editar/remover a qualquer momento.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="seller-3">
                <AccordionTrigger>Quais as comissões?</AccordionTrigger>
                <AccordionContent>
                  As comissões variam por categoria e campanha. Exibimos a taxa estimada antes da publicação do produto ou serviço.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Prestadores de Serviços</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="prov-1">
                <AccordionTrigger>Como me torno prestador?</AccordionTrigger>
                <AccordionContent>
                  Cadastre-se em “Prestador de Serviços”. Após verificar dados básicos, poderá listar serviços (instalação, montagem, suporte técnico, etc.).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="prov-2">
                <AccordionTrigger>Atendo em domicílio?</AccordionTrigger>
                <AccordionContent>
                  Sim. Defina a disponibilidade, raio de atendimento e tarifas no seu painel. O cliente escolhe um horário e confirma.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="prov-3">
                <AccordionTrigger>Posso emitir orçamento?</AccordionTrigger>
                <AccordionContent>
                  Sim. O cliente envia a solicitação, você responde com um orçamento e prazos. O cliente confirma e seguimos com a execução.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white border rounded-md p-4 md:col-span-2">
            <h3 className="font-medium mb-2">Segurança e Suporte</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sec-1">
                <AccordionTrigger>Meus dados estão seguros?</AccordionTrigger>
                <AccordionContent>
                  Utilizamos práticas modernas de segurança e apenas o essencial para executar pedidos. Para atendimento humano, use nosso WhatsApp oficial.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sec-2">
                <AccordionTrigger>Não encontrei minha resposta…</AccordionTrigger>
                <AccordionContent>
                  Fale conosco no WhatsApp para atendimento rápido:
                  <a
                    href="https://wa.me/258863181415"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block ml-1 text-blue-600 underline"
                  >
                    Abrir WhatsApp
                  </a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}