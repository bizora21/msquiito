import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-lg">LojaRápida</h4>
          <p className="text-sm text-slate-600 mt-2">Apoio a vendedores locais e entregas rápidas em Moçambique.</p>
          <div className="mt-4 text-sm">
            <div>Contato: <a href="tel:+258863181415" className="text-blue-600">+258863181415</a></div>
            <div>WhatsApp: <a href="https://wa.me/258863181415" target="_blank" rel="noreferrer" className="text-blue-600">Abrir Chat</a></div>
          </div>
        </div>

        <div className="flex flex-col">
          <h5 className="font-semibold">Links</h5>
          <nav className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/produtos" className="text-slate-700">Produtos</Link>
            <Link to="/servicos" className="text-slate-700">Serviços</Link>
            <Link to="/vendedor/register" className="text-slate-700">Torne-se Vendedor</Link>
            <Link to="/prestador/register" className="text-slate-700">Torne-se Prestador</Link>
          </nav>
        </div>

        <div>
          <h5 className="font-semibold">Ajuda</h5>
          <ul className="mt-3 text-sm space-y-2">
            <li><a href="/faq" className="text-slate-700">FAQ</a></li>
            <li><a href="/terms" className="text-slate-700">Termos de Uso</a></li>
            <li><a href="/privacy" className="text-slate-700">Política de Privacidade</a></li>
          </ul>

          <div className="mt-4">
            <a href="/vendedor/register" className="inline-block bg-green-500 text-white px-3 py-2 rounded-md">Torne-se Vendedor</a>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} LojaRápida — Todos os direitos reservados</div>
          <div>Feito para Moçambique</div>
        </div>
      </div>
    </footer>
  );
}