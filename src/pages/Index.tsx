import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import ChatBot from "@/components/ChatBot";

export default function Index() {
  React.useEffect(() => {
    document.title = "LojaRápida — Comércio local em Moçambique";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "LojaRápida conecta clientes, vendedores e prestadores de serviços em Moçambique. Entrega rápida e pagamento na entrega.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <Header />
      <main className="pt-20">
        <Hero />
        <ProductGrid limit={6} />
        <ServicesGrid />

        <section className="py-6">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h3 className="text-lg font-semibold">Por que escolher a LojaRápida?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Entrega local, suporte por WhatsApp e foco em vendedores moçambicanos.
            </p>
          </div>
        </section>

        <Faq />
      </main>
      <Footer />

      <ChatBot />
    </div>
  );
}