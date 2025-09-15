"use client";

import { Product, Wishlist } from '@/types/api-type';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface WishlistContextType {
    wishlist: Wishlist[];
    addToWishlist: (item: Product, quantity?: number, notes?: string) => void;
    removeFromWishlist: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updateNotes: (id: string, notes: string) => void;
    clearWishlist: () => void;
    isInWishlist: (id: string) => boolean;
    getWishlistTotal: () => number;
    getWishlistItemsCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Wishlist[]>([]);

    useEffect(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("whishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (item: Product, quantity = 1, notes?: string) => {
        setWishlist((prevWishlist) => {
            const existingItem = prevWishlist.find((wishlistItem) => wishlistItem.id === item.id);
            if (existingItem) {
                return prevWishlist.map((wishlistItem) =>
                    wishlistItem.id === item.id
                        ? { ...wishlistItem, quantity: wishlistItem.quantity + quantity, notes }
                        : wishlistItem,
                );
            }
            return [...prevWishlist, { ...item, quantity, notes }];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromWishlist(id);
            return;
        }
        setWishlist((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const updateNotes = (id: string, notes: string) => {
        setWishlist((prevWishlist) => prevWishlist.map((item) => (item.id === id ? { ...item, notes } : item)));
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    const isInWishlist = (id: string) => {
        return wishlist.some(item => item.id === id);
    };

    const getWishlistTotal = () => {
        return wishlist.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getWishlistItemsCount = () => {
        return wishlist.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, updateQuantity, updateNotes, clearWishlist, isInWishlist ,getWishlistTotal, getWishlistItemsCount }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
