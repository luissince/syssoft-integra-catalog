// components/ProductSection.tsx
"use client";

import { House, RefreshCcw, Search, X } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";

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
    Input
} from "@/components/ui/input";
import { MenuCard } from "./MenuCard";
import { Product } from "@/types/api-type";
import Container from "./Container";
import Image from "next/image";

interface Props {
    categories: any[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;

    products: Product[];

    searchQuery: string;
    itemsPerPage: number;
    totalProducts: number;

    setSearchQuery: (value: string) => void;
    clearSearch: () => void;

    changeItemsPerPage: (value: number) => void;

    loadMoreItems: () => void;

    reloadProducts: () => Promise<void>;
}

export default function ProductSection({
    categories,
    selectedCategory,
    setSelectedCategory,

    products,

    searchQuery,
    itemsPerPage,
    totalProducts,

    setSearchQuery,
    clearSearch,

    changeItemsPerPage,

    loadMoreItems,

    reloadProducts
}: Props) {

    return (
        <Container>
            <div className="flex gap-6">
                <div className="flex-1">
                    {/* Encabezado */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 pt-3">
                        {/* Titulo */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <House className="h-5 w-5" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-foreground md:text-2xl">
                                    {categories.find((cat) => cat.id === selectedCategory)?.name || "Todos los productos"}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {totalProducts} productos {searchQuery ? 'encontrados' : 'disponibles'}
                                </p>
                            </div>
                        </div>

                        {/* Categorías */}
                        <div className="flex items-center gap-2">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center">
                                            Categorías
                                            <IoIosArrowDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {categories.map((category) => (
                                            <DropdownMenuItem
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <Image
                                                    src={category.image || "/placeholder.svg"}
                                                    alt={category.name}
                                                    width={20}
                                                    height={20}
                                                />
                                                <span>{category.name}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            {itemsPerPage} productos
                                            <IoIosArrowDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
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
                    </div>

                    {/* Filtrar */}
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

                        <Button
                            variant="outline"
                            // variant="ghost"
                            type="button"
                            className="absolute inset-y-0 right-0"
                            onClick={reloadProducts}>
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* No se encontraron productos */}
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

                    {/* Productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {products.map((item) => (
                            <MenuCard
                                key={item.idProduct}
                                item={item}
                            />
                        ))}
                    </div>

                    {products.length < totalProducts && (
                        <Button
                            onClick={loadMoreItems}
                            className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                            Ver más
                        </Button>
                    )}
                </div>

                {/* {authEnabled && (
                        <div className="w-full max-w-md hidden lg:block">
                            <CartList />
                        </div>
                    )} */}
            </div>
        </Container>
    )
};