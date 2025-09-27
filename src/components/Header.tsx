import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, Home } from "lucide-react";
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
    <header className="w-full fixed top-0 left-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200" role="banner">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Abrir menu de navegação"
            aria-expanded={openMobile}
            onClick={() => setOpenMobile(!openMobile)}
          >
            <Menu size={20} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold" aria-hidden="true">
              LR
            </div>
            <span className="font-semibold text-lg text-slate-800">LojaRápida</span>
          </Link>
        </div>

        <form onSubmit={onSearch} className="flex-1 mx-4 hidden sm:flex items-center max-w-xl" role="search">
          <label htmlFor="search-input" className="sr-only">Pesquisar produtos ou serviços</label>
          <input
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar produtos ou serviços..."
            className="w-full px-3 py-2 rounded-l-md border border-r-0 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Campo de pesquisa"
          />
          <Button type="submit" className="rounded-r-md" aria-label="Executar pesquisa">
            Pesquisar
          </Button>
        </form>

        <nav className="flex items-center gap-3" role="navigation" aria-label="Menu principal">
          <Link 
            to="/" 
            className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            aria-label="Ir para página inicial"
          >
            <Home size={16} />
            Início
          </Link>
          <Link 
            to="/produtos" 
            className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Produtos
          </Link>
          <Link 
            to="/servicos" 
            className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Serviços
          </Link>
          <Link 
            to="/blog" 
            className="hidden sm:inline text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Blog
          </Link>

          <UserMenu />

          <button
            onClick={() => setOpenCart(true)}
            aria-label={`Abrir carrinho de compras${count > 0 ? ` (${count} ${count === 1 ? 'item' : 'itens'})` : ' (vazio)'}`}
            className={cn("relative p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500")}
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs px-2 min-w-[20px] h-5 flex items-center justify-center"
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>

          <Link to="/checkout">
            <Button className="hidden md:inline-flex bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500">
              Compre Agora
            </Button>
          </Link>
        </nav>
      </div>

      {openMobile && (
        <div className="sm:hidden bg-white border-t border-gray-200 p-4" role="navigation" aria-label="Menu mobile">
          <form onSubmit={onSearch} className="mb-3" role="search">
            <label htmlFor="mobile-search" className="sr-only">Pesquisar</label>
            <input
              id="mobile-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>
          <div className="flex flex-col gap-2">
            <Link to="/" className="py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">
              <Home size={16} />
              Início
            </Link>
            <Link to="/produtos" className="py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">Produtos</Link>
            <Link to="/servicos" className="py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">Serviços</Link>
            <Link to="/blog" className="py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">Blog</Link>
            <Link to="/cliente/register" className="py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">Criar conta</Link>
            <Link to="/login" className="py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">Entrar</Link>
          </div>
        </div>
      )}

      <CartDrawer open={openCart} onOpenChange={setOpenCart} />
    </header>
  );
}