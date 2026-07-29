"use client";

import { Search, X } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Button
} from "@/components/ui/button";

import {
    Badge
} from "@/components/ui/badge";

import {
    Input
} from "@/components/ui/input";
import { MenuCard } from "./MenuCard";
import { CartList } from "./CartList";
import { Product } from "@/types/api-type";


interface Props {
    categories: any[];
    selectedCategory: string;
    products: Product[];
    searchQuery: string;

    itemsPerPage: number;
    totalProducts: number;
    loading: boolean;

    authEnabled: boolean;
    currency: any;
    cart: any[];

    setSearchQuery: (value: string) => void;
    clearSearch: () => void;

    changeItemsPerPage: (value: number) => void;

    loadMoreItems: () => void;

    addToCart: (item: any) => void;
    updateQuantity: (id: string, value: number) => void;
    removeFromCart: (id: string) => void;

    router: any;
}

export default function ProductSection({
    categories,
    selectedCategory,
    products,
    searchQuery,

    authEnabled,
    currency,
    cart,

    itemsPerPage,
    totalProducts,
    loading,

    setSearchQuery,
    clearSearch,

    changeItemsPerPage,

    loadMoreItems,

    addToCart,
    updateQuantity,
    removeFromCart,

    router,
}: Props) {

    return (
        <div className="flex-1 flex">
            <div className="container mx-auto py-8 px-4 flex gap-8 h-full">
                <div className="flex-1">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground">
                                {categories.find((cat) => cat.id === selectedCategory)?.name || "Todos los productos"}
                            </h2>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mt-2">
                                {totalProducts} productos {searchQuery ? 'encontrados' : 'disponibles'}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Mostrar:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-8 px-2 text-sm">
                                        {itemsPerPage} productos
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            changeItemsPerPage(6);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        6 productos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            changeItemsPerPage(12);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        12 productos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            changeItemsPerPage(24);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        24 productos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            changeItemsPerPage(48);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        48 productos
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="relative w-full mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 bg-background border-border focus:border-primary"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {products.length === 0 && searchQuery && (
                        <div className="text-center py-12">
                            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                No se encontraron productos
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                No encontramos productos que coincidan con "{searchQuery}"
                            </p>
                            <Button
                                onClick={clearSearch}
                                variant="outline"
                                className="px-6"
                            >
                                Limpiar búsqueda
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                        {products.map((item) => (
                            <MenuCard
                                key={item.id}
                                item={item}
                                onAddToCart={addToCart}
                                currency={currency}
                                authEnabled={authEnabled}
                            />
                        ))}
                    </div>

                    {products.length < totalProducts && (
                        <Button
                            onClick={loadMoreItems}
                            className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            Ver más
                        </Button>
                    )}
                </div>

                {authEnabled && (
                    <div className="w-auto hidden lg:block">
                        <div className="sticky">
                            <CartList
                                cart={cart}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeFromCart}
                                onCheckout={() => router.push("/checkout")}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};