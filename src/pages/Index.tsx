import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";

export default function Index() {
  React.useEffect(() => {
    document.title = "LojaRápida — Comércio local em Moçambique";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "LojaRápida conecta clientes, vendedores e prestadores de serviços em Moçambique. Entrega rápida e pagamento na entrega.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <Hero />
        <ProductGrid limit={6} />
        <ServicesGrid />
        <section className="py-6">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-semibold mb-3">Depoimentos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="font-medium">Ana M.</div>
                <div className="text-sm text-slate-600">"Entrega rápida e atendimento por WhatsApp — recomendo!"</div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="font-medium">Carlos D.</div>
                <div className="text-sm text-slate-600">"Plataforma prática, vendi meus primeiros produtos no primeiro mês."</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <details className="bg-white p-3 rounded-md border">
                <summary className="font-medium">Como funciona o pagamento?</summary>
                <div className="mt-2">Pagamento na entrega (Cash on Delivery) — o cliente paga ao entregador.</div>
              </details>
              <details className="bg-white p-3 rounded-md border">
                <summary className="font-medium">Como me torno vendedor?</summary>
                <div className="mt-2">Clique em 'Torne-se Vendedor' e preencha o formulário de cadastro.</div>
              </details>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h3 className="text-lg font-semibold">Por que escolher a LojaRápida?</h3>
            <p className="text-sm text-slate-600 mt-2">Entrega local, suporte por WhatsApp e foco em vendedores moçambicanos.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}