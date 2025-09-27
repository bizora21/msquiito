import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-20 pb-8 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="animate-in fade-in-50">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              LojaRápida — Comprar local ficou mais fácil
            </h1>
            <p className="mt-4 text-slate-600">
              Conectamos clientes, vendedores e prestadores de serviços em Moçambique — entregas rápidas, pagamento na entrega e suporte por WhatsApp.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/produtos">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-[1.02]">Ver Produtos</Button>
              </Link>
              <Link to="/vendedor/register">
                <Button variant="outline" className="transition-transform hover:scale-[1.02]">Seja um Vendedor</Button>
              </Link>
            </div>

            <ul className="mt-6 text-sm text-slate-500 space-y-2">
              <li>Pagamento na entrega (Cash on Delivery)</li>
              <li>Notificações por WhatsApp/SMS</li>
              <li>Suporte local e entregas rápidas</li>
            </ul>
          </div>

          <div className="flex items-center justify-center animate-in zoom-in-50">
            <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 shadow-sm">
              <img
                src="/placeholder.svg"
                alt="LojaRápida destaque"
                loading="lazy"
                className="w-full h-56 object-contain"
              />
              <div className="mt-3 text-sm text-slate-700">
                Promoções locais e vendedores verificados — encontre ofertas próximas a você.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}