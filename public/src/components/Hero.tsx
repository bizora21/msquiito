import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-emerald-50/60 to-transparent">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store size={32} className="text-green-600" />
            <h2 className="text-xl font-semibold text-green-800">LojaRápida</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Conecte seu negócio local em Moçambique
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Plataforma que ajuda vendedores e prestadores de serviços a expandirem seus negócios, 
            conectando você diretamente com clientes em todo o país.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/produtos" className="w-full sm:w-auto">
              <Button 
                className="w-full group transition-transform hover:scale-[1.02] bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <ShoppingBag className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Explorar Produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendedor/register" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="w-full transition-transform hover:scale-[1.02] bg-green-500 hover:bg-green-600 text-white border-transparent"
              >
                Torne-se Parceiro
                <Store className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>+50 vendedores locais</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Entregas em todo Moçambique</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-green-100 rounded-full p-8 animate-in fade-in-50">
            <img 
              src="/placeholder.svg" 
              alt="LojaRápida marketplace" 
              className="w-64 h-64 object-contain transform hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}