import * as React from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { useNavigate, Link } from "react-router-dom";
import HomeButton from "@/components/HomeButton";
import { isLoggedIn, getSession } from "@/utils/auth";
import { createOrder } from "@/utils/orders";
import { sendOrderNotifications } from "@/utils/notifications";

export default function Checkout() {
  const { enriched, total, clear } = useCart();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const navigate = useNavigate();
  const logged = isLoggedIn();
  const session = getSession();

  React.useEffect(() => {
    document.title = "Checkout — LojaRápida";
    if (session?.name) setName((v) => v || session.name || "");
    if (session?.phone) setPhone((v) => v || session.phone || "");
    if (session?.address) setAddress((v) => v || session.address || "");
  }, [session?.name, session?.phone, session?.address]);

  if (enriched.length === 0) {
    return (
      <main className="pt-24 max-w-3xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
        <HomeButton />
        <div className="bg-white border rounded-md p-6">
          <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
          <Link to="/produtos" className="inline-block mt-4">
            <Button>Ver produtos</Button>
          </Link>
        </div>
      </main>
    );
  }

  const confirm = () => {
    const items = enriched.map(({ product, qty, subtotal }) => ({
      id: product.id,
      name: product.name,
      qty,
      price: product.price,
      subtotal,
    }));
    const order = createOrder({
      items,
      total,
      customerName: name || session?.name,
      customerPhone: phone || session?.phone,
      address,
      feePct: 0.09,
    });
    showSuccess("Pedido confirmado! Você receberá atualizações por WhatsApp/Email.");
    if (session?.phone) {
      sendOrderNotifications({
        name: name || session?.name || "Cliente",
        email: session?.email,
        whatsapp: session?.phone,
        orderId: order.id,
        total,
      });
    }
    clear();
    navigate("/dashboard/cliente");
  };

  return (
    <main className="pt-24 max-w-4xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      {!logged && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 text-sm">
          Antes de finalizar, entre ou crie sua conta de cliente para acompanhar seus pedidos:
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to="/login"><Button size="sm">Entrar</Button></Link>
            <Link to="/cliente/register"><Button size="sm" variant="outline">Criar conta</Button></Link>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-md p-6">
          <h2 className="font-semibold mb-3">Resumo</h2>
          <ul className="space-y-3">
            {enriched.map(({ product, qty, subtotal }) => (
              <li key={product.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{product.name} x {qty}</span>
                <span className="font-medium">MT {subtotal}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span>Total</span>
            <span className="text-lg font-semibold">MT {total}</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Pagamento na entrega • Taxa da plataforma aplicada ao vendedor após confirmação
          </div>
        </div>

        <div className="bg-white border rounded-md p-6">
          {step === 1 ? (
            <>
              <h2 className="font-semibold mb-3">Seus dados</h2>
              <div className="space-y-3">
                <input placeholder="Nome completo" className="w-full border px-3 py-2 rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Telefone/WhatsApp" className="w-full border px-3 py-2 rounded-md" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input placeholder="Endereço de entrega" className="w-full border px-3 py-2 rounded-md" value={address} onChange={(e) => setAddress(e.target.value)} />
                <Button className="w-full" onClick={() => setStep(2)}>Continuar</Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-semibold mb-3">Confirmação</h2>
              <div className="text-sm text-slate-700">
                <div><strong>Nome:</strong> {name || session?.name || "—"}</div>
                <div><strong>Telefone:</strong> {phone || session?.phone || "—"}</div>
                <div><strong>Endereço:</strong> {address || session?.address || "—"}</div>
                <div className="mt-3">Pagamento: na entrega (Cash on Delivery)</div>
              </div>
              <Button className="w-full mt-4" onClick={confirm} disabled={!logged}>
                {logged ? "Confirmar Pedido" : "Entre para confirmar"}
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}