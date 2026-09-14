"use client";

import { useState, useEffect, useCallback } from "react";

import {
    Category,
    CompanyBanner,
    Product,
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
    authEnabled = false,
}: HomeComponentProps) {

    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [products, setProducts] = useState(initialProducts.data);

    const [totalProducts, setTotalProducts] = useState(
        initialProducts.count
    );

    const [itemsPerPage, setItemsPerPage] = useState(6);

    const [offset, setOffset] = useState(
        initialProducts.data.length
    );

    // --------------------------------------------------
    // BANNER
    // --------------------------------------------------

    useEffect(() => {

        if (banners.length <= 1) {
            return;
        }

        const interval = setInterval(() => {

            setCurrentBannerIndex(
                (prev) => (prev + 1) % banners.length
            );

        }, 5000);

        return () => clearInterval(interval);

    }, [banners.length]);


    // --------------------------------------------------
    // FILTRAR PRODUCTOS
    // --------------------------------------------------

    const filterProducts = useCallback(
        async (
            reset = true,
            pageSize = itemsPerPage
        ) => {

            try {

                setLoading(true);

                const result = await fetchProducts({
                    search: searchQuery,

                    filters: {
                        categories: selectedCategory
                            ? [
                                  {
                                      id: selectedCategory,
                                  },
                              ]
                            : [],
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
                        ...result.data,
                    ]);

                    setOffset(
                        (prev) =>
                            prev + result.data.length
                    );
                }

                setTotalProducts(result.count);

            } finally {

                setLoading(false);

            }

        },
        [
            searchQuery,
            selectedCategory,
            itemsPerPage,
            offset,
        ]
    );


    // --------------------------------------------------
    // BUSCAR / FILTRAR
    // --------------------------------------------------

    useEffect(() => {

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

    }, [
        searchQuery,
        selectedCategory,
        filterProducts,
    ]);


    // --------------------------------------------------
    // CAMBIAR CANTIDAD
    // --------------------------------------------------

    const changeItemsPerPage = (
        value: number
    ) => {

        setItemsPerPage(value);

        setOffset(0);

        filterProducts(true, value);
    };


    // --------------------------------------------------
    // LIMPIAR BUSQUEDA
    // --------------------------------------------------

    const clearSearch = () => {

        setSearchQuery("");

    };


    // --------------------------------------------------
    // CARGAR MÁS
    // --------------------------------------------------

    const loadMoreItems = () => {

        filterProducts(false);

    };


    // --------------------------------------------------
    // RECARGAR TODO
    // --------------------------------------------------

    const reloadProducts = async () => {

        setSearchQuery("");
        setSelectedCategory("");
        setOffset(0);

        try {

            setLoading(true);

            const result = await fetchProducts({
                search: "",
                filters: {
                    categories: [],
                },
                currentPage: 0,
                totalPage: itemsPerPage,
            });

            setProducts(result.data);

            setTotalProducts(result.count);

            setOffset(result.data.length);

        } finally {

            setLoading(false);

        }
    };


    return (
        <>
            <HeroBanner
                banners={banners}
                setCurrentBannerIndex={
                    setCurrentBannerIndex
                }
                currentBannerIndex={
                    currentBannerIndex
                }
            />

            <div className="relative">

                <ProductSection
                    categories={categories}

                    selectedCategory={
                        selectedCategory
                    }

                    setSelectedCategory={
                        setSelectedCategory
                    }

                    products={products}

                    searchQuery={searchQuery}

                    itemsPerPage={itemsPerPage}

                    totalProducts={totalProducts}

                    authEnabled={authEnabled}

                    setSearchQuery={
                        setSearchQuery
                    }

                    clearSearch={clearSearch}

                    changeItemsPerPage={
                        changeItemsPerPage
                    }

                    loadMoreItems={
                        loadMoreItems
                    }

                    reloadProducts={
                        reloadProducts
                    }
                />

                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px]">
                        <div className="sticky top-20 flex justify-center pt-10">
                            <div className="rounded-md bg-white px-4 py-2 shadow">
                                Cargando productos...
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}