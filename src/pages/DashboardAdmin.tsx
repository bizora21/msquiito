import * as React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders, getOrdersSummary } from "@/utils/orders";
import HomeButton from "@/components/HomeButton";

function Content() {
  const [summary, setSummary] = React.useState(getOrdersSummary());
  const [orders, setOrders] = React.useState(() => getOrders());

  React.useEffect(() => {
    const id = setInterval(() => {
      setSummary(getOrdersSummary());
      setOrders(getOrders());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="pt-24 max-w-6xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent">
      <HomeButton />
      <h1 className="text-2xl font-semibold">Painel do Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader><CardTitle>Pedidos</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{summary.totalOrders}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vendas Brutas</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">MT {summary.gross}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Taxas (Plataforma)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-700">MT {summary.fees}</div></CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Pedidos recentes</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-sm text-slate-600">Sem pedidos registrados ainda.</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Data</th>
                    <th className="py-2 pr-4">Cliente</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Taxa (9%)</th>
                    <th className="py-2">Itens</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b">
                      <td className="py-2 pr-4">{o.id}</td>
                      <td className="py-2 pr-4">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-4">{o.customerName || "—"}</td>
                      <td className="py-2 pr-4">MT {o.total}</td>
                      <td className="py-2 pr-4">MT {o.platformFee}</td>
                      <td className="py-2">
                        <div className="max-w-[360px] truncate" title={o.items.map(i => `${i.name} x${i.qty}`).join(", ")}>
                          {o.items.map(i => `${i.name} x${i.qty}`).join(", ")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function DashboardAdmin() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <Content />
    </ProtectedRoute>
  );
}