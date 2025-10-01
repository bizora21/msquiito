import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-emerald-50/60 to-transparent">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Conecte seu negócio com clientes em todo o Brasil
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma completa para vendedores e prestadores de serviço expandirem seus negócios
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/produtos" className="w-full sm:w-auto">
              <Button 
                className="w-full transition-transform hover:scale-[1.02] bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Explorar Produtos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendedor/register" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="w-full transition-transform hover:scale-[1.02] bg-green-500 hover:bg-green-600 text-white border-transparent"
              >
                Seja um Vendedor
              </Button>
            </Link>
          </div>
        </div>
        {/* Rest of the component remains the same */}
      </div>
    </section>
  );
}