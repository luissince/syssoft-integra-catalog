"use client";

import { useState, useEffect } from "react";

import {
    Category,
    Company,
    CompanyBanner,
    Product
} from "@/types/api-type";

import HeroBanner from "./HeroBanner";
import ProductSection from "./ProductSection";

import { fetchProducts } from "@/data/data-rest";
import { SkeletonProducts } from "./ui/skeleton";

interface HomeComponentProps {
    company: Company;
    categories: Category[];
    banners: CompanyBanner[];
    initialProducts: {
        data: Product[];
        count: number;
    };
    authEnabled?: boolean;
}

export default function HomeComponent({
    company,
    categories,
    banners,
    initialProducts,
    authEnabled = false
}: HomeComponentProps) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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

        // No hacemos nada al montar.
        // Los productos ya vienen desde Server Component.

        if (
            searchQuery === "" &&
            selectedCategory === ""
        ) {
            return;
        }

        const timer = setTimeout(() => {
            filterProducts(true);
        }, 500);

        return () => clearTimeout(timer);

    }, [searchQuery, selectedCategory]);


    const filterProducts = async (
        reset = true,
        pageSize = itemsPerPage
    ) => {

        try {

            setLoading(true);

            const result = await fetchProducts({
                search: searchQuery,

                filters: {
                    categories: [
                        {
                            id: selectedCategory
                        }
                    ]
                },

                currentPage: reset ? 0 : offset,

                totalPage: pageSize,
            });

            if (reset) {

                setProducts(result.data);

                setOffset(result.data.length);

            } else {

                setProducts((prev) => [
                    ...prev,
                    ...result.data
                ]);

                setOffset((prev) =>
                    prev + result.data.length
                );
            }

            setTotalProducts(result.count);

        } finally {

            setLoading(false);

        }
    };


    const changeItemsPerPage = (value: number) => {

        setItemsPerPage(value);
        setOffset(0);

        // Pasamos "value" directamente porque
        // setItemsPerPage todavía no actualizó el state.
        filterProducts(true, value);
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

                    setSearchQuery={setSearchQuery}
                    clearSearch={clearSearch}

                    changeItemsPerPage={changeItemsPerPage}
                    loadMoreItems={loadMoreItems}
                />
            )}
        </>
    );
}