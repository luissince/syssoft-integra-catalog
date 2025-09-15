"use client";

import { Cart, Product } from '@/types/api-type';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface CartContextType {
    cart: Cart[];
    addToCart: (item: Product, quantity?: number, notes?: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updateNotes: (id: string, notes: string) => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: Product, quantity = 1, notes?: string) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity, notes } : cartItem,
                );
            }
            return [...prevCart, { ...item, quantity, notes }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const updateNotes = (id: string, notes: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, notes } : item)));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (id: string) => {
        return cart.some(item => item.id === id);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartItemsCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateNotes, clearCart, isInCart,getCartTotal, getCartItemsCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
