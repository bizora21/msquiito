import * as React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";

function Content() {
  return (
    <main className="pt-24 max-w-5xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <h1 className="text-2xl font-semibold">Dashboard do Prestador</h1>
      <div className="bg-white border rounded-md p-4 mt-4">
        <h2 className="font-medium mb-2">Tarefas atribuídas</h2>
        <ul className="text-sm text-slate-600 list-disc pl-4">
          <li>Nenhuma tarefa no momento. Ative sua disponibilidade.</li>
        </ul>
        <div className="mt-3">
          <Button>Ativar disponibilidade</Button>
        </div>
      </div>
    </main>
  );
}

export default function DashboardProvider() {
  return (
    <ProtectedRoute roles={["provider"]}>
      <Content />
    </ProtectedRoute>
  );
}