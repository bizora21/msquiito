import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomeButton from "@/components/HomeButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/60 to-transparent">
      <div className="text-center px-4">
        <HomeButton className="mx-auto max-w-max" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Página não encontrada</p>
      </div>
    </div>
  );
};

export default NotFound;