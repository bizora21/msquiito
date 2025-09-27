import * as React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Content() {
  return (
    <main className="pt-24 max-w-5xl mx-auto px-4">
      <h1 className="text-2xl font-semibold">Minha Conta</h1>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white border rounded-md p-4">
          <h2 className="font-medium mb-2">Meus pedidos</h2>
          <div className="text-sm text-slate-600">Você ainda não possui pedidos. Comece agora!</div>
          <Link to="/produtos">
            <Button className="mt-3">Explorar produtos</Button>
          </Link>
        </div>
        <div className="bg-white border rounded-md p-4">
          <h2 className="font-medium mb-2">Favoritos</h2>
          <div className="text-sm text-slate-600">Adicione produtos à lista de desejos para ver aqui.</div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardClient() {
  return (
    <ProtectedRoute roles={["client"]}>
      <Content />
    </ProtectedRoute>
  );
}