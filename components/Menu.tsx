// components/Menu.tsx
'use client';

import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import { Button } from "./ui/button";
import { House, MessageSquareMore, ShoppingCart, ClipboardList } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Menu() {
    const router = useRouter();
    const pathname = usePathname();

    const { cart } = useCart();

    const items = [
        {
            label: "Inicio",
            path: "/",
            icon: House,
        },
        {
            label: "Pedido",
            path: "/cart",
            icon: ClipboardList,
            isCart: true,
        },
        {
            label: "Pagar",
            path: "/checkout",
            icon: ShoppingCart,
        },
        {
            label: "Contacto",
            path: "/contact",
            icon: MessageSquareMore,
        },
    ];

    return (
        <nav className="block md:hidden bg-card border-t border-border sticky bottom-0 z-10 shadow-sm">
            <Container>
                <div className="w-full flex items-center justify-between">
                    {items.map(({ label, path, icon: Icon, isCart }) => {
                        const selected = pathname === path;

                        return (
                            <Button
                                key={path}
                                variant="ghost"
                                type="button"
                                onClick={() => router.push(path)}
                                className="h-auto py-2 relative"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <Icon
                                        className={`!w-5 !h-5 ${selected
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                            }`}
                                        strokeWidth={selected ? 2.5 : 2}
                                    />
                                    <span
                                        className={
                                            selected
                                                ? "text-primary font-semibold"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {label}
                                    </span>
                                </div>

                                {isCart && cart.length > 0 && (
                                    <span
                                        className={cn(
                                            "absolute",
                                            "-top-1",
                                            "-right-1",
                                            "min-w-5",
                                            "h-5",
                                            "px-1",
                                            "rounded-full",
                                            "bg-primary",
                                            "text-primary-foreground",
                                            "text-xs",
                                            "font-bold",
                                            "flex",
                                            "items-center",
                                            "justify-center",
                                        )}>
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </Container>
        </nav>
    );
}