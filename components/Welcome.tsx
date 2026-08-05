// components/Welcome.tsx
"use client";

import { Store } from "lucide-react";
import { useState, useEffect } from "react";

const Welcome = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bg-white inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8">
        {/* Logo/Icono animado */}
        <div className="relative">
          <div className="mx-auto rounded-full flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Texto de bienvenida */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-black">
            Bienvenido
          </h1>
          <p className="text-muted-foreground">
            Preparando tu experiencia
          </p>
        </div>

        {/* Indicador de carga */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm text-muted-foreground">
            Preparando tu experiencia{dots}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-64 mx-auto bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{
            animation: 'loadingBar 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Welcome;