import * as React from "react";
import { services } from "@/lib/sample-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";

export default function Servicos() {
  React.useEffect(() => {
    document.title = "Serviços — LojaRápida";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Encontre prestadores de serviços locais de confiança.");
  }, []);

  return (
    <main className="pt-24 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <div className="max-w-5xl mx-auto px-4">
        <HomeButton />
        <h1 className="text-2xl font-semibold mb-4">Serviços</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white border rounded-md p-4">
              <img src={s.image || "/placeholder.svg"} alt={s.name} className="w-full h-40 object-contain rounded" loading="lazy" />
              <h2 className="font-medium mt-3">{s.name}</h2>
              <div className="text-sm text-slate-600 mt-1">{s.description}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Desde MT {s.priceFrom}</div>
                <Link to={`/servico/${s.id}`}><Button size="sm">Ver</Button></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}