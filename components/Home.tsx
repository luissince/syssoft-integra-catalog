"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import type { Order } from "@/types";
import Welcome from "@/components/Welcome";
import { useRouter } from "next/navigation";
import { NavPrimary } from "@/components/Nav";
import Footer from "@/components/Footer";
import { Branch, Category, Company, CompanyBanner, Product, Whatsapp } from "@/types/api-type";

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [ordersLoaded, setOrdersLoaded] = useState(false);
    const [visibleItems, setVisibleItems] = useState(4);
    
    // Estado para controlar si el componente está montado (evita hidratación)
    const [isMounted, setIsMounted] = useState(false);

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

    // Load orders only after component is mounted
    useEffect(() => {
        if (!isMounted) return;
        
        const loadOrders = async () => {
            try {
                const savedOrders = localStorage.getItem("orders");
                if (savedOrders) {
                    const parsedOrders = JSON.parse(savedOrders);
                    setOrders(parsedOrders);
                }
            } catch (error) {
                console.error("Error loading orders:", error);
            } finally {
                setOrdersLoaded(true);
            }
        };
        
        loadOrders();
    }, [isMounted]);

    // Save orders to localStorage
    useEffect(() => {
        if (ordersLoaded && isMounted) {
            try {
                localStorage.setItem("orders", JSON.stringify(orders));
            } catch (error) {
                console.error("Error saving orders:", error);
            }
        }
    }, [orders, ordersLoaded, isMounted]);

    // Loading state management
    useEffect(() => {
        if (ordersLoaded && selectedCategory) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [ordersLoaded, selectedCategory]);

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
        setVisibleItems(prevVisibleItems => prevVisibleItems + 4);
    };

    // Show loading component while hydrating or loading
    if (isLoading || !isMounted) {
        return <Welcome company={company} branch={branch} />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavPrimary
                company={company}
                categories={categories}
                whatsapp={whatsapp}
                branch={branch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-8 md:py-12 border-b border-border overflow-hidden">
                {banners.length > 0 && (
                    <div className="absolute inset-0">
                        {banners.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentBannerIndex ? 'opacity-70' : 'opacity-0'
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
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
                                <span className="text-primary drop-shadow-sm">{company.name}</span>
                            </h1>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed drop-shadow-sm">
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
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentBannerIndex
                                        ? 'bg-primary scale-125'
                                        : 'bg-white/50 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </section>

            <div className="flex-1 flex">
                <div className="container mx-auto px-4 py-8 flex gap-8 h-full">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground font-display">
                                    {categories.find((cat) => cat.id === selectedCategory)?.name || "Todos los productos"}
                                </h2>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mt-2">
                                    {filteredItems.length} productos {searchQuery ? 'encontrados' : 'disponibles'}
                                </Badge>
                            </div>

                            <div className="relative w-full lg:w-80">
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
                        <div className="w-80 hidden lg:block">
                            <div className="sticky top-24">
                                {/* Cart component would go here */}
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