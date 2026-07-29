// components/ErrorPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  title: string;
  message: string;
  icon?: string;
}

export default function ErrorPage({
  code,
  title,
  message,
  icon = "🔍"
}: Props) {

  const [dots, setDots] = useState("");

  const router = useRouter();


  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className={cn(
      "fixed",
      "inset-0",
      "bg-gradient-to-br",
      "from-red-50",
      "via-background",
      "to-orange-50",
      "dark:from-red-950/20",
      "dark:via-background",
      "dark:to-orange-950/20",
      "flex",
      "items-center",
      "justify-center",
      "z-50"
    )}>

      <div className="text-center space-y-8 p-8 max-w-md">

        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <span className="text-6xl animate-bounce">
            {icon}
          </span>
        </div>


        <div className="space-y-4">

          <h1 className="text-6xl font-bold text-red-500">
            {code}
          </h1>

          <h2 className="text-3xl font-bold">
            {title}
          </h2>

          <p className="text-muted-foreground text-lg">
            {message} {dots}
          </p>

        </div>


        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Button
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2"/>
            Inicio
          </Button>


          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2"/>
            Regresar
          </Button>


          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2"/>
            Recargar
          </Button>

        </div>

      </div>

    </div>
  );
}