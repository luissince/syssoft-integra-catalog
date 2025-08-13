"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Branch, Company } from "@/types/api-type";

interface NotFoundProps {
  company: Company;
  branch: Branch;
}

const NotFound = ({ company, branch }: NotFoundProps) => {
  const [dots, setDots] = useState("");
  const [isFloating, setIsFloating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const floatInterval = setInterval(() => {
      setIsFloating(prev => !prev);
    }, 2000);

    return () => clearInterval(floatInterval);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20 flex items-center justify-center z-50">
      <div className="text-center space-y-8 p-8 max-w-md">
        {/* Logo/Icono animado con error */}
        <div className="relative">
          <div className={`mx-auto rounded-full flex items-center justify-center transition-transform duration-2000 ${
            isFloating ? 'transform translate-y-0' : 'transform -translate-y-2'
          }`}>
            {company?.logo ? (
              <div className="relative">
                <img
                  src={company.logo}
                  alt={company.name || "Logo"}
                  className="w-24 h-24 object-contain opacity-50 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl animate-bounce">❌</span>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="text-6xl animate-bounce">🔍</span>
              </div>
            )}
          </div>
          
          {/* Círculos decorativos */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-200 dark:bg-red-800/30 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-200 dark:bg-orange-800/30 rounded-full animate-pulse"></div>
        </div>
        
        {/* Mensaje de error */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold font-display text-red-500 dark:text-red-400">
              404
            </h1>
            <h2 className="text-3xl font-bold text-foreground">
              ¡Oops! Página no encontrada
            </h2>
          </div>
          
          <div className="space-y-3">
            <p className="text-muted-foreground text-lg">
              La página que buscas parece haberse perdido {dots}
            </p>
            {company?.name && (
              <p className="text-sm text-muted-foreground">
                Regresa a <span className="font-semibold text-primary">{company.name}</span> y encuentra lo que necesitas
              </p>
            )}
          </div>
        </div>

        {/* Indicador de búsqueda fallida */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Buscando alternativas{dots}
          </p>
        </div>

        {/* Barra de progreso con efecto de error */}
        <div className="w-64 mx-auto bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse" style={{
            animation: 'errorBar 3s ease-in-out infinite',
            width: '30%'
          }}></div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={handleGoHome}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al inicio
          </Button>
          
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="border-border hover:bg-muted px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </Button>
          
          <Button 
            onClick={handleRefresh}
            variant="ghost"
            className="hover:bg-muted px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Recargar
          </Button>
        </div>

        {/* Sugerencias adicionales */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">
            ¿No encuentras lo que buscas?
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-3 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
              🏠 Inicio
            </span>
            <span className="px-3 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
              📱 Contacto
            </span>
            <span className="px-3 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
              🍽️ Menú
            </span>
            <span className="px-3 py-1 bg-muted rounded-full text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
              ℹ️ Ayuda
            </span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes errorBar {
          0% { width: 10%; transform: translateX(-100%); }
          50% { width: 30%; transform: translateX(200%); }
          100% { width: 10%; transform: translateX(400%); }
        }
        
        .transition-transform {
          transition-property: transform;
        }
        
        .duration-2000 {
          transition-duration: 2s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;