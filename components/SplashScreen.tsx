"use client"

import { useState, useEffect, useRef } from "react"
import { Wheat } from "lucide-react"
import { useTheme } from "next-themes"

export function SplashScreen() {
    const refContainer = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(true)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Ocultar el splash screen después de 2.5 segundos
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2500)

        // Bloquear el scroll mientras se muestra el splash
        if (isVisible) {
            refContainer.current?.classList.add("overflow-hidden")
            // document.body.style.overflow = "hidden"
        }

        return () => {
            clearTimeout(timer)
            refContainer.current?.classList.remove("overflow-auto")
            // document.body.style.overflow = "auto"
        }
    }, [isVisible])

    if (!isVisible) return null

    // Si no está montado aún, mostrar versión por defecto
    const isDarkMode = mounted ? resolvedTheme === "dark" : false

    return (
        <div
            ref={refContainer}
            className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? "bg-stone-900" : "bg-[#FDF6EC]"}`}
        >
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6">
                    <div
                        className={`absolute inset-0 ${isDarkMode ? "bg-amber-700/20" : "bg-amber-600/20"} rounded-full animate-pulse`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Wheat className={`h-16 w-16 ${isDarkMode ? "text-amber-500" : "text-amber-700"}`} />
                    </div>
                </div>
                <h1 className={`text-4xl font-bold ${isDarkMode ? "text-amber-300" : "text-amber-800"} font-serif mb-2`}>
                    Masa & Miga
                </h1>
                <p className={`text-lg ${isDarkMode ? "text-amber-400/80" : "text-amber-700/80"} text-center max-w-xs`}>
                    Pan de verdad, café de origen, momentos auténticos
                </p>
                <div className="mt-8 h-1 w-32 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 dark:bg-amber-500 animate-[progress_2s_ease-in-out]"></div>
                </div>
            </div>
        </div>
    )
}
