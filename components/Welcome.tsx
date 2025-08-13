"use client";
import { Branch, Company } from "@/types/api-type";
import Image from "next/image";
import { useState, useEffect } from "react";
// import restaurantData from "@/data/restaurant-data.json";

interface WelcomeProps {
  company: Company;
  branch: Branch;
}

const Welcome = ({ company, branch }: WelcomeProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8">
        {/* Logo/Icono animado */}
        <div className="relative">
          <div className="mx-auto rounded-full flex items-center justify-center animate-pulse">
            {/* <span className="text-4xl">🍗</span> */}
            <Image
              src={company.logo || "/placeholder.svg"}
              alt={company.name}
              width={160}
              height={40}
            />      
          </div>
        </div>
        
        {/* Texto de bienvenida */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-black">
            {/* {restaurantData.restaurant.owner} */}
            {company.name}
          </h1>
          {/* <h2 className="text-2xl font-semibold text-foreground">
            {restaurantData.restaurant.name}
          </h2> */}
          <p className="text-muted-foreground">
            {/* {restaurantData.restaurant.description} */}
            {company.information}
          </p>
        </div>

        {/* Indicador de carga */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Preparando tu experiencia{dots}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-64 mx-auto bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{
            animation: 'loadingBar 2s ease-in-out infinite'
          }}></div>
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