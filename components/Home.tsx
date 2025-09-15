"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import Welcome from "@/components/Welcome";
import { NavPrimary } from "@/components/Nav";
import Footer from "@/components/Footer";
import { Branch, Category, Company, CompanyBanner, Product, Whatsapp } from "@/types/api-type";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartList } from "./CartList";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

interface HomeComponentProps {
    company: Company;
    categories: Category[];
    banners: CompanyBanner[];
    whatsapp: Whatsapp;
    branch: Branch;
    initialProducts: Product[];
    authEnabled?: boolean; // Pasar como prop desde el servidor
}

export default function HomeComponent({
    company,
    categories,
    banners,
    whatsapp,
    branch,
    initialProducts,
    authEnabled = false
}: HomeComponentProps) {

    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [visibleItems, setVisibleItems] = useState(6);

    const { cart, updateQuantity, removeFromCart, addToCart } = useCart();

    // Estado para controlar si el componente está montado (evita hidratación)
    const [isMounted, setIsMounted] = useState(false);
    const { currency } = useCurrency();

    // Efecto para marcar el componente como montado
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Banner carousel effect
    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentBannerIndex((prev) =>
                    (prev + 1) % banners.length
                );
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    // Filter products
    const filteredItems = initialProducts.filter((item) => {
        const matchesCategory = "" === selectedCategory || item.idCategory === selectedCategory;
        const matchesSearch = searchQuery === "" ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const clearSearch = () => {
        setSearchQuery("");
    };

    const loadMoreItems = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    // Show loading component while hydrating or loading
    if (!isMounted) {
        return <Welcome company={company} branch={branch} />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavPrimary
                company={company}
                categories={categories}
                whatsapp={whatsapp}
                branch={branch}
                authEnabled={authEnabled}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-20 border-b border-border">
                {banners.length > 0 && (
                    <div className="absolute inset-0">
                        {banners.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-70' : 'opacity-0'
                                    }`}
                                style={{
                                    backgroundImage: `url(${banner.url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/40" />
                    </div>
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl md:text-4xl font-bold font-display">
                                <span className="text-primary drop-shadow-sm">{company.name}</span>
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed drop-shadow-sm">
                                {company.information}
                            </p>
                        </div>
                    </div>
                </div>

                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBannerIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentBannerIndex
                                    ? 'bg-primary scale-125'
                                    : 'bg-white/50 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </section>

            <div className="flex-1 flex">
                <div className="container mx-auto py-8 px-4 flex gap-8 h-full">
                    <div className="flex-1">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground font-display">
                                    {categories.find((cat) => cat.id === selectedCategory)?.name || "Todos los productos"}
                                </h2>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mt-2">
                                    {filteredItems.length} productos {searchQuery ? 'encontrados' : 'disponibles'}
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
                                                setItemsPerPage(6);
                                                setVisibleItems(6);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            6 productos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setItemsPerPage(12);
                                                setVisibleItems(12);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            12 productos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setItemsPerPage(24);
                                                setVisibleItems(24);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            24 productos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setItemsPerPage(48);
                                                setVisibleItems(48);
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

                        {filteredItems.length === 0 && searchQuery && (
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
                            {filteredItems.slice(0, visibleItems).map((item) => (
                                <MenuCard
                                    key={item.id}
                                    item={item}
                                    onAddToCart={addToCart}
                                    currency={currency}
                                    authEnabled={authEnabled}
                                />
                            ))}
                        </div>

                        {visibleItems < filteredItems.length && (
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

            <Footer
                company={company}
                categories={categories}
                whatsapp={whatsapp}
                branch={branch}
                setSelectedCategory={setSelectedCategory}
            />
        </div>
    );
}