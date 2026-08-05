// components/Home.tsx
"use client";

import { useState, useEffect } from "react";
import Welcome from "@/components/Welcome";
import { Category, Company, CompanyBanner, Product } from "@/types/api-type";
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
    initialProducts: { data: Product[], count: number };
    authEnabled?: boolean; // Pasar como prop desde el servidor
}

export default function HomeComponent({
    company,
    categories,
    banners,
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
    const { currency } = useCurrency();


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
        } finally {
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

    return (
        <>
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

                setSelectedCategory={setSelectedCategory}

                setSearchQuery={setSearchQuery}
                clearSearch={clearSearch}

                changeItemsPerPage={changeItemsPerPage}

                loadMoreItems={loadMoreItems}

                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}

                router={router}
            />
        </>
    );
}