// components/Home.tsx
"use client";

import { useState, useEffect } from "react";
import Welcome from "@/components/Welcome";
import { NavPrimary } from "@/components/Nav";
import Footer from "@/components/Footer";
import { Branch, Category, Company, CompanyBanner, Product, Whatsapp } from "@/types/api-type";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import HeroBanner from "./HeroBanner";
import ProductSection from "./ProductSection";
import { getProducts } from "@/lib/api";

interface HomeComponentProps {
    company: Company;
    categories: Category[];
    banners: CompanyBanner[];
    whatsapp: Whatsapp;
    branch: Branch;
    initialProducts: { data: Product[], count: number };
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

    const [products, setProducts] = useState(initialProducts.data);
    const [totalProducts, setTotalProducts] = useState(initialProducts.count);

    const [offset, setOffset] = useState(initialProducts.data.length);

    const [loading, setLoading] = useState(false);

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

    useEffect(() => {

        if (!isMounted) return;

        const timer = setTimeout(() => {
            filterProducts(true);
        }, 500);


        return () => clearTimeout(timer);

    }, [
        searchQuery,
        selectedCategory,
        itemsPerPage
    ]);

    // Filter products
    const filterProducts = async (reset = true) => {

        try {

            setLoading(true);

            const result = await getProducts({
                search: searchQuery,
                currentPage: reset ? 0 : offset,
                totalPage: itemsPerPage,
            });


            if (reset) {

                setProducts(result.data);

                setOffset(result.data.length);

            } else {

                setProducts(prev => [
                    ...prev,
                    ...result.data
                ]);

                setOffset(prev => prev + result.data.length);
            }


            setTotalProducts(result.count);


        }  finally {

            setLoading(false);

        }
    };

    const changeItemsPerPage = (value: number) => {
        setItemsPerPage(value);

        setOffset(0);

        setTimeout(() => {
            filterProducts(true);
        }, 0);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const loadMoreItems = () => {
        filterProducts(false);
    };

    // Show loading component while hydrating or loading
    if (!isMounted) {
        return <Welcome company={company} />;
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

            <HeroBanner
                company={company}
                banners={banners}
                setCurrentBannerIndex={setCurrentBannerIndex}
                currentBannerIndex={currentBannerIndex}
            />

            <ProductSection
                categories={categories}
                selectedCategory={selectedCategory}
                products={products}
                searchQuery={searchQuery}

                authEnabled={authEnabled}
                currency={currency}
                cart={cart}

                itemsPerPage={itemsPerPage}
                totalProducts={totalProducts}
                loading={loading}

                setSearchQuery={setSearchQuery}
                clearSearch={clearSearch}

                changeItemsPerPage={changeItemsPerPage}

                loadMoreItems={loadMoreItems}

                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}

                router={router}
            />

            <Footer
                company={company}
                whatsapp={whatsapp}
                branch={branch}
            />
        </div>
    );
}