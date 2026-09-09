// components/Home.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { Category, Company, CompanyBanner, Product } from "@/types/api-type";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import HeroBanner from "./HeroBanner";
import ProductSection from "./ProductSection";
import { fetchProducts } from "@/data/data-rest";
import { SkeletonProducts } from "./ui/skeleton";

interface HomeComponentProps {
    company: Company;
    categories: Category[];
    banners: CompanyBanner[];
    initialProducts: { data: Product[], count: number };
    authEnabled?: boolean;
}

export default function HomeComponent({
    company,
    categories,
    banners,
    initialProducts,
    authEnabled = false
}: HomeComponentProps) {

    const router = useRouter();

    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [products, setProducts] = useState(initialProducts.data);
    const [totalProducts, setTotalProducts] = useState(initialProducts.count);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [offset, setOffset] = useState(initialProducts.data.length);

    const { cart, updateQuantity, removeFromCart, addToCart } = useCart();

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
            const result = await fetchProducts({
                search: searchQuery,
                filters: {
                    categories: [{
                        id: selectedCategory
                    }]
                },
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


            {loading ? (
                <SkeletonProducts />
            ) : (
                <ProductSection
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}

                    products={products}

                    searchQuery={searchQuery}
                    itemsPerPage={itemsPerPage}
                    totalProducts={totalProducts}

                    authEnabled={authEnabled}
                    currency={currency}
                    cart={cart}

                    setSearchQuery={setSearchQuery}
                    clearSearch={clearSearch}

                    changeItemsPerPage={changeItemsPerPage}

                    loadMoreItems={loadMoreItems}

                    addToCart={addToCart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}

                    router={router}
                />
            )}
        </>
    );
}