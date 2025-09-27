import * as React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";

function Content() {
  return (
    <main className="pt-24 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-semibold">Dashboard do Vendedor</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white border rounded-md p-4">
          <div className="text-xs text-slate-500">Pedidos</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white border rounded-md p-4">
          <div className="text-xs text-slate-500">Produtos vendidos</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white border rounded-md p-4">
          <div className="text-xs text-slate-500">Avaliações</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white border rounded-md p-4">
          <div className="text-xs text-slate-500">Cupons ativos</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <div className="bg-white border rounded-md p-4 mt-6">
        <h2 className="font-medium mb-3">Cadastrar novo produto</h2>
        <form className="grid gap-3 md:grid-cols-2">
          <input placeholder="Nome do produto" className="border rounded px-3 py-2" />
          <input placeholder="Preço (MT)" className="border rounded px-3 py-2" type="number" />
          <input placeholder="Categoria" className="border rounded px-3 py-2 md:col-span-2" />
          <textarea placeholder="Descrição" className="border rounded px-3 py-2 md:col-span-2" rows={3} />
          <div className="md:col-span-2 flex items-center justify-between">
            <input type="file" className="text-sm" />
            <Button type="button">Salvar produto</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function DashboardVendor() {
  return (
    <ProtectedRoute roles={["vendor"]}>
      <Content />
    </ProtectedRoute>
  );
}