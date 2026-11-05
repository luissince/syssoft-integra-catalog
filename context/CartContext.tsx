"use client";

import { Cart, Product } from "@/types/api-type";
import {
    createContext,
    useContext,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";

const CART_STORAGE_KEY = "cart";
const CART_CHANNEL_NAME = "cart-sync";

interface CartContextType {
    cart: Cart[];
    addToCart: (item: Product, quantity?: number, notes?: string) => void;
    removeFromCart: (idProduct: string) => void;
    updateQuantity: (idProduct: string, quantity: number) => void;
    updateNotes: (idProduct: string, notes: string) => void;
    clearCart: () => void;
    isInCart: (idProduct: string) => boolean;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {

    const [cart, setCart] = useState<Cart[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const channelRef = useRef<BroadcastChannel | null>(null);

    // Evita que una actualización recibida por BroadcastChannel
    // vuelva a ser enviada a las demás pestañas.
    const skipBroadcastRef = useRef(false);

    /**
     * Inicializar carrito
     */
    useEffect(() => {

        try {

            const savedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            }

        } catch (error) {

            console.error("Error al cargar el carrito:", error);

        }

        /**
         * Crear canal de sincronización
         */
        const channel = new BroadcastChannel(CART_CHANNEL_NAME);

        channelRef.current = channel;

        channel.onmessage = (event) => {

            if (event.data?.type !== "CART_UPDATED") {
                return;
            }

            const newCart = event.data.cart;

            if (!Array.isArray(newCart)) {
                return;
            }

            // Esta actualización viene de otra pestaña.
            // No debemos volver a emitirla.
            skipBroadcastRef.current = true;

            setCart(newCart);
        };

        setIsInitialized(true);

        return () => {

            channel.close();

            channelRef.current = null;

        };

    }, []);

    /**
     * Persistir + sincronizar carrito
     */
    useEffect(() => {

        if (!isInitialized) {
            return;
        }

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error("Error al guardar el carrito:", error);

        }

        /**
         * Si la actualización vino de otra pestaña,
         * no volvemos a enviarla.
         */
        if (skipBroadcastRef.current) {

            skipBroadcastRef.current = false;

            return;
        }

        /**
         * Avisar a las demás pestañas
         */
        channelRef.current?.postMessage({
            type: "CART_UPDATED",
            cart,
        });

    }, [cart, isInitialized]);

    /**
     * Agregar producto
     */
    const addToCart = (
        item: Product,
        quantity = 1,
        notes?: string
    ) => {

        setCart((prevCart) => {

            const existingItem = prevCart.find(
                (cartItem) =>
                    cartItem.idProduct === item.idProduct
            );

            if (existingItem) {

                return prevCart.map((cartItem) =>
                    cartItem.idProduct === item.idProduct
                        ? {
                              ...cartItem,
                              quantity:
                                  cartItem.quantity + quantity,
                              notes,
                          }
                        : cartItem
                );

            }

            return [
                ...prevCart,
                {
                    ...item,
                    quantity,
                    notes,
                },
            ];

        });

    };

    /**
     * Eliminar producto
     */
    const removeFromCart = (idProduct: string) => {

        setCart((prevCart) =>
            prevCart.filter(
                (item) => item.idProduct !== idProduct
            )
        );

    };

    /**
     * Actualizar cantidad
     */
    const updateQuantity = (
        idProduct: string,
        quantity: number
    ) => {

        if (quantity <= 0) {

            removeFromCart(idProduct);

            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.idProduct === idProduct
                    ? {
                          ...item,
                          quantity,
                      }
                    : item
            )
        );

    };

    /**
     * Actualizar notas
     */
    const updateNotes = (
        idProduct: string,
        notes: string
    ) => {

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.idProduct === idProduct
                    ? {
                          ...item,
                          notes,
                      }
                    : item
            )
        );

    };

    /**
     * Vaciar carrito
     */
    const clearCart = () => {

        setCart([]);

    };

    /**
     * Saber si un producto está en el carrito
     */
    const isInCart = (idProduct: string) => {

        return cart.some(
            (item) => item.idProduct === idProduct
        );

    };

    /**
     * Total del carrito
     */
    const getCartTotal = () => {

        return cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

    };

    /**
     * Cantidad total de unidades
     */
    const getCartItemsCount = () => {

        return cart.reduce(
            (count, item) =>
                count + item.quantity,
            0
        );

    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateNotes,
                clearCart,
                isInCart,
                getCartTotal,
                getCartItemsCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {

    const context = useContext(CartContext);

    if (context === undefined) {

        throw new Error(
            "useCart must be used within a CartProvider"
        );

    }

    return context;
}