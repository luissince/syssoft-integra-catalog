"use client";
import { useState, useEffect } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import type { Order } from "@/types";
import restaurantData from "@/data/restaurant-data.json";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Welcome from "@/components/Welcome";
import { useRouter } from "next/navigation";
import { OrderCompletion } from "@/components/OrderCompletion";
import { NavSecondary } from "@/components/Nav";

export default function Component() {
    const router = useRouter()
    const { isAuthenticated, user } = useAuth();
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const { cart, clearCart } = useCart();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const savedOrders = localStorage.getItem("orders");
                if (savedOrders) {
                    const parsedOrders = JSON.parse(savedOrders);
                    setOrders(parsedOrders);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };

        loadOrders();
    }, []);

    const handleSubmitOrder = (orderData: Order) => {
        const newOrders = [...orders, orderData];
        setCompletedOrder(orderData);
        localStorage.setItem("orders", JSON.stringify(newOrders));
        clearCart();
    };

    // if (isLoading) {
    //     return <Welcome />;
    // }

      if (completedOrder) {
        return (
          <OrderCompletion
            order={completedOrder}
            restaurant={restaurantData.restaurant}
            onBackToMenu={() => router.push("/")}
          />
        );
      }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <NavSecondary />
            
            {/* Body */}
            <div className="container mx-auto p-4">
                <CheckoutForm
                    isAuthenticated={isAuthenticated}
                    user={user!}
                    cart={cart}
                    paymentMethods={restaurantData.paymentMethods}
                    deliveryZones={restaurantData.deliveryZones}
                    onSubmitOrder={handleSubmitOrder}
                    onBack={() => router.push("/")}
                />
            </div>
        </div>
    );
}
