import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";

export default function Servico() {
  const { id } = useParams<{ id: string }>();
  const service = getServiceById(id);

  React.useEffect(() => {
    if (service) {
      document.title = `${service.name} — LojaRápida`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", service.description || "");
    }
  }, [service]);

  if (!service) {
    return (
      <main className="pt-24 max-w-3xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent">
        <HomeButton />
        <h2 className="text-xl font-semibold">Serviço não encontrado</h2>
        <Link to="/servicos" className="text-blue-600 mt-2 inline-block">Voltar</Link>
      </main>
    );
  }

  return (
    <main className="pt-24 max-w-3xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent">
      <HomeButton />
      <div className="bg-white border rounded-md p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-64 object-contain rounded" loading="lazy" />
          <div>
            <h1 className="text-2xl font-semibold">{service.name}</h1>
            <p className="text-slate-700 mt-2">{service.description}</p>
            <div className="mt-4 text-xl font-bold">Desde MT {service.priceFrom}</div>
            <div className="mt-6 flex gap-3">
              <Button>Solicitar Serviço</Button>
              <Link to="/prestador/register"><Button variant="outline">Torne-se Prestador</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}