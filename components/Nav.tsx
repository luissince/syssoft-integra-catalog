// components/Nav.tsx
'use client';

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, Phone, Settings, MenuIcon, User, UserPlus } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { useContact } from "@/lib/contact";
import { Branch, Company, Person } from "@/types/api-type";
import Image from "next/image";
import Container from "./Container";
import { fetchLogoutCustomer } from "@/data/data-rest";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface NavProps {
    company: Company;
    branch: Branch;
    person: Person | null;
}

export default function Nav({ company, branch, person }: NavProps) {
    const router = useRouter();
    const { handleCall } = useContact();

    const [loginOpen, setLoginOpen] = useState(false);

    const { theme, setTheme } = useTheme();


    const handleCallClick = () => {
        handleCall(branch.phone);
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    const handleLogout = async () => {
        const { success } = await fetchLogoutCustomer();

        if (!success) {
            return;
        }

        router.refresh();
    };

    return (
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
            <Container>
                <div className="flex items-center justify-between">
                    <div className="w-24">
                        <Image
                            src={company.logo || "/placeholder.svg"}
                            alt={company.name}
                            width={100}
                            height={50}
                            className="w-full h-auto"
                        />

                    </div>
                    {/* Desktop */}
                    <div className="hidden lg:flex items-center space-x-2 md:space-x-4 text-sm">
                        {/* Botones de contacto - Desktop */}
                        <Button
                            onClick={handleCallClick}
                            size="sm"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Llamar
                        </Button>

                        <ThemeToggle

                        />

                        {
                            person ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                                            <Settings className="w-4 h-4 text-primary mr-2" />
                                            <span>Administrar</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                            <LogOut className="w-4 h-4 text-primary mr-2" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <LoginCard
                                    open={loginOpen}
                                    onOpenChange={setLoginOpen}
                                />
                            )
                        }
                    </div>


                    {/* Tablet/Mobile */}
                    <div className="lg:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <MenuIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={handleCallClick} className="cursor-pointer">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <div className="flex flex-col">
                                        <span>Llamar</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={toggleTheme}
                                    className="cursor-pointer"
                                >
                                    {theme === "light" ? (
                                        <Moon className="w-4 h-4 mr-2" />
                                    ) : (
                                        <Sun className="w-4 h-4 mr-2" />
                                    )}

                                    <div className="flex flex-col">
                                        <span>
                                            {theme === "light"
                                                ? "Modo oscuro"
                                                : "Modo claro"}
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setLoginOpen(true)}
                                    className="cursor-pointer"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    <div className="flex flex-col">
                                        <span>Iniciar Sesión</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Container>
        </header>
    );
}