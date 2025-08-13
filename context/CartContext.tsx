"use client"
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { CartItem, MenuItem } from "@/types";

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    updateNotes: (itemId: string, notes: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: MenuItem, quantity = 1, notes?: string) => {
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

    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
    };

    const updateNotes = (itemId: string, notes: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, notes } : item)));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartItemsCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateNotes, clearCart, getCartTotal, getCartItemsCount }}>
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
