import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [query, setQuery] = React.useState("");
  const [openMobile, setOpenMobile] = React.useState(false);
  const [openCart, setOpenCart] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const navigate = useNavigate();
  const { count } = useCart();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/produtos?q=${encodeURIComponent(query)}`);
    setOpenSearch(false);
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm" 
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo e Menu Mobile */}
        <div className="flex items-center gap-2">
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500" 
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-md flex items-center justify-center font-bold">
                    LR
                  </div>
                  LojaRápida
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-2">
                <Link 
                  to="/" 
                  className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={() => setOpenMobile(false)}
                >
                  Início
                </Link>
                <Link 
                  to="/produtos" 
                  className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={() => setOpenMobile(false)}
                >
                  Produtos
                </Link>
                <Link 
                  to="/servicos" 
                  className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={() => setOpenMobile(false)}
                >
                  Serviços
                </Link>
                <Link 
                  to="/blog" 
                  className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={() => setOpenMobile(false)}
                >
                  Blog
                </Link>
                <div className="border-t pt-2">
                  <UserMenu />
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link 
            to="/" 
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
          >
            <div className="w-8 h-8 bg-green-500 text-white rounded-md flex items-center justify-center font-bold">
              LR
            </div>
            <span className="font-semibold text-lg text-slate-800 hidden sm:inline">
              LojaRápida
            </span>
          </Link>
        </div>

        {/* Ações Móveis */}
        <div className="flex items-center gap-2">
          {/* Botão de Busca Mobile */}
          <button 
            onClick={() => setOpenSearch(true)} 
            className="p-2 rounded-md hover:bg-gray-100 sm:hidden"
            aria-label="Abrir busca"
          >
            <Search size={22} />
          </button>

          {/* Carrinho */}
          <button
            onClick={() => setOpenCart(true)}
            className={cn("relative p-2 rounded-md hover:bg-gray-100")}
            aria-label={`Carrinho (${count} itens)`}
          >
            <ShoppingCart size={22} />
            {count > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center"
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Busca Desktop */}
        <form 
          onSubmit={onSearch} 
          className="flex-1 mx-4 hidden sm:flex items-center max-w-xl"
        >
          <input
            placeholder="Pesquisar produtos ou serviços..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-l-md border border-r-0 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <Button type="submit" className="rounded-r-md h-10 px-5">
            Pesquisar
          </Button>
        </form>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <Link 
            to="/produtos" 
            className="text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2.5 py-1.5"
          >
            Produtos
          </Link>
          <Link 
            to="/servicos" 
            className="text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2.5 py-1.5"
          >
            Serviços
          </Link>
          <Link 
            to="/blog" 
            className="text-sm text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2.5 py-1.5"
          >
            Blog
          </Link>
          <UserMenu />
        </div>
      </div>

      {/* Modal de Busca Mobile */}
      <Sheet open={openSearch} onOpenChange={setOpenSearch}>
        <SheetContent side="top" className="h-auto">
          <form onSubmit={onSearch} className="flex items-center gap-2 mt-4">
            <input
              placeholder="Pesquisar produtos ou serviços..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <Button type="submit">Buscar</Button>
          </form>
        </SheetContent>
      </Sheet>

      <CartDrawer open={openCart} onOpenChange={setOpenCart} />
    </header>
  );
}