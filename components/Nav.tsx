// components/Nav.tsx
'use client';

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Phone, Settings, MenuIcon, User, UserPlus } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { useContact } from "@/lib/contact";
import { Branch, Company } from "@/types/api-type";
import Image from "next/image";
import Container from "./Container";

interface NavProps {
    company: Company;
    branch: Branch;
    authEnabled: boolean;
}

export default function Nav({ company, branch, authEnabled }: NavProps) {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { handleCall } = useContact();

    const handleCallClick = () => {
        handleCall(branch.phone);
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
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="sm"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Llamar
                        </Button>

                        <ThemeToggle />

                        {authEnabled && (
                            isAuthenticated ? (
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
                                        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                                            <LogOut className="w-4 h-4 text-primary mr-2" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <LoginCard />
                            )
                        )}
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
                                    onClick={() => {

                                    }}
                                    className="cursor-pointer"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    <div className="flex flex-col">
                                        <span>Iniciar Sesión</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {

                                    }}
                                    className="cursor-pointer"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    <div className="flex flex-col">
                                        <span>Crear Cuenta</span>
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