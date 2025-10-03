import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeButton({ className = "" }: { className?: string }) {
  return (
    <div className={`mb-4 ${className}`} aria-label="Navegação secundária">
      <Link to="/" aria-label="Voltar à página inicial">
        <Button variant="outline" className="flex items-center gap-2">
          <Home size={16} aria-hidden="true" />
          Voltar ao início
        </Button>
      </Link>
    </div>
  );
}