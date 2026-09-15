"use client";

import { useState, useEffect } from "react";

import {
    Category,
    CompanyBanner,
    Product
} from "@/types/api-type";

import HeroBanner from "./HeroBanner";
import ProductSection from "./ProductSection";

import { fetchProducts } from "@/data/data-rest";
import { SkeletonProducts } from "./ui/skeleton";

interface HomeComponentProps {
    categories: Category[];
    banners: CompanyBanner[];
    initialProducts: {
        data: Product[];
        count: number;
    };
    authEnabled?: boolean;
}

export default function HomeComponent({
    categories,
    banners,
    initialProducts,
    authEnabled = false
}: HomeComponentProps) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const [restart, setRestart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const [products, setProducts] = useState(initialProducts.data);
    const [totalProducts, setTotalProducts] = useState(initialProducts.count);

    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [offset, setOffset] = useState(initialProducts.data.length);

    // Banner
    useEffect(() => {

        if (banners.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) =>
                (prev + 1) % banners.length
            );
        }, 5000);

        return () => clearInterval(interval);

    }, [banners.length]);


    // Buscar / filtrar productos
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedSearchQuery === "" && selectedCategory === "") {
            return;
        }

        filterProducts(true);
    }, [debouncedSearchQuery, selectedCategory]);

    useEffect(() => {
        if (restart) {
            filterProducts(true);
            setRestart(false);
        }
    }, [restart]);

    useEffect(() => {
        if (loading) {
            return;
        }

        filterProducts(true);
    }, [itemsPerPage]);

    const filterProducts = async (
        reset = true,
        pageSize = itemsPerPage
    ) => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);

            const result = await fetchProducts({
                search: debouncedSearchQuery,
                filters: {
                    categories: selectedCategory
                        ? [
                            {
                                id: selectedCategory
                            }
                        ]
                        : []
                },
                currentPage: reset ? 0 : offset,
                totalPage: pageSize,
            });

            if (reset) {
                setProducts(result.data);
                setOffset(result.data.length);
            } else {
                setProducts(prev => [
                    ...prev,
                    ...result.data
                ]);

                setOffset(prev =>
                    prev + result.data.length
                );
            }

            setTotalProducts(result.count);
        } finally {
            setLoading(false);
        }
    };

    const changeItemsPerPage = (value: number) => {
        if (loading) {
            return;
        }
        setItemsPerPage(value);
        setOffset(0);
    };

    const clearSearch = () => {
        if (loading) {
            return;
        }
        setSearchQuery("");
    };

    const loadMoreItems = () => {
        if (loading) {
            return;
        }
        filterProducts(false);
    };

    // --------------------------------------------------
    // RECARGAR TODO
    // --------------------------------------------------
    const reloadProducts = async () => {
        if (loading) {
            return;
        }
        setSearchQuery("");
        setSelectedCategory("");
        setProducts([]);
        setOffset(0);
        setRestart(true);

    };

    return (
        <>
            <HeroBanner
                banners={banners}
                setCurrentBannerIndex={setCurrentBannerIndex}
                currentBannerIndex={currentBannerIndex}
            />

            {
                loading && <SkeletonProducts />
            }

            {
                !loading && (
                    <ProductSection
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}

                        products={products}

                        searchQuery={searchQuery}

                        itemsPerPage={itemsPerPage}
                        totalProducts={totalProducts}

                        authEnabled={authEnabled}

                        setSearchQuery={setSearchQuery}
                        clearSearch={clearSearch}

                        changeItemsPerPage={changeItemsPerPage}
                        loadMoreItems={loadMoreItems}
                        reloadProducts={reloadProducts}
                    />
                )
            }
        </>
    );
}