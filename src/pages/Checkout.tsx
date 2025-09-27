import * as React from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { enriched, total, clear } = useCart();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Checkout — LojaRápida";
  }, []);

  if (enriched.length === 0) {
    return (
      <main className="pt-24 max-w-3xl mx-auto px-4">
        <div className="bg-white border rounded-md p-6">
          <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
        </div>
      </main>
    );
  }

  const confirm = () => {
    // Pagamento na entrega
    showSuccess("Pedido confirmado! Você receberá atualizações por WhatsApp/SMS.");
    clear();
    navigate("/");
  };

  return (
    <main className="pt-24 max-w-4xl mx-auto px-4">
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
                <div><strong>Nome:</strong> {name || "—"}</div>
                <div><strong>Telefone:</strong> {phone || "—"}</div>
                <div><strong>Endereço:</strong> {address || "—"}</div>
                <div className="mt-3">Pagamento: na entrega (Cash on Delivery)</div>
              </div>
              <Button className="w-full mt-4" onClick={confirm}>Confirmar Pedido</Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}