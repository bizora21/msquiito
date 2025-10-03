import React from "react";
import { Link } from "react-router-dom";
import { services } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

export default function ServicesGrid() {
  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Serviços em destaque</h2>
          <Link to="/servicos" className="text-sm text-blue-600 hover:underline">Explorar serviços</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white border border-gray-100 p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in-50">
              <img src={s.image} alt={s.name} loading="lazy" className="w-full h-36 object-contain rounded-md" />
              <h3 className="mt-3 font-medium">{s.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{s.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Desde MT {s.priceFrom}</div>
                <Button size="sm" onClick={() => window.location.assign(`/servico/${s.id}`)}>Ver</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}