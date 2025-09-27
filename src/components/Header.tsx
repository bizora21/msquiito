import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const [query, setQuery] = React.useState("");
  const [openMobile, setOpenMobile] = React.useState(false);
  const [openCart, setOpenCart] = React.useState(false);
  const navigate = useNavigate();
  const { count } = useCart();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/produtos?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-white/70 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Abrir menu"
            onClick={() => setOpenMobile(!openMobile)}
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
              LR
            </div>
            <span className="font-semibold text-lg text-slate-800">LojaRápida</span>
          </Link>
        </div>

        <form onSubmit={onSearch} className="flex-1 mx-4 hidden sm:flex items-center max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar produtos ou serviços..."
            className="w-full px-3 py-2 rounded-l-md border border-r-0 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Pesquisar"
          />
          <Button type="submit" className="rounded-r-md">
            Pesquisar
          </Button>
        </form>

        <nav className="flex items-center gap-3">
          <Link to="/produtos" className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900">
            Produtos
          </Link>
          <Link to="/servicos" className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900">
            Serviços
          </Link>

          <UserMenu />

          <button
            onClick={() => setOpenCart(true)}
            aria-label="Carrinho"
            className={cn("relative p-2 rounded-md hover:bg-gray-100")}
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs px-2">
                {count}
              </span>
            )}
          </button>

          <Link to="/checkout">
            <Button className="hidden md:inline-flex bg-green-600 hover:bg-green-700">Compre Agora</Button>
          </Link>
        </nav>
      </div>

      {openMobile && (
        <div className="sm:hidden bg-white border-t border-gray-200 p-4">
          <form onSubmit={onSearch} className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full px-3 py-2 rounded-md border border-gray-200"
            />
          </form>
          <div className="flex flex-col gap-2">
            <Link to="/produtos" className="py-2">Produtos</Link>
            <Link to="/servicos" className="py-2">Serviços</Link>
            <Link to="/cliente/register" className="py-2">Criar conta</Link>
            <Link to="/login" className="py-2">Entrar</Link>
          </div>
        </div>
      )}

      <CartDrawer open={openCart} onOpenChange={setOpenCart} />
    </header>
  );
}