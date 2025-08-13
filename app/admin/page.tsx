"use client";
import { useState, useEffect } from "react";
import { AdminPanel } from "@/components/AdminPanel";
import type { RestaurantData, Order, MenuItem } from "@/types";
import restaurantData from "@/data/restaurant-data.json";
import Welcome from "@/components/Welcome";
import { NavSecondary } from "@/components/Nav";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Component() {
    const router = useRouter()
    const { isAuthenticated, authLoading } = useAuth();
    const [data, setData] = useState<RestaurantData>(restaurantData as RestaurantData);
    const [orders, setOrders] = useState<Order[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [ordersLoaded, setOrdersLoaded] = useState(false);

    useEffect(() => {
        if (authLoading) {
            if (!isAuthenticated) {
                router.push("/");
            }
        }
    }, [authLoading]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const savedOrders = localStorage.getItem("orders");
                if (savedOrders) {
                    const parsedOrders = JSON.parse(savedOrders);
                    setOrders(parsedOrders);
                }
                setOrdersLoaded(true);
            } catch (error) {
                setOrdersLoaded(true);
            }
        };

        loadOrders();
    }, []);
    
    useEffect(() => {
        if (ordersLoaded) {
            localStorage.setItem("orders", JSON.stringify(orders));
        }
    }, [orders, ordersLoaded]);

    useEffect(() => {
        const checkLoadingComplete = () => {
            if (ordersLoaded && data) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
        };

        checkLoadingComplete();
    }, [ordersLoaded, data]);


    const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    };

    const handleAddMenuItem = (newItem: Omit<MenuItem, "id">) => {
        const item: MenuItem = {
            ...newItem,
            id: Date.now().toString(),
        };
        setData((prev) => ({
            ...prev,
            menuItems: [...prev.menuItems, item],
        }));
    };

    const handleUpdateMenuItem = (updatedItem: MenuItem) => {
        setData((prev) => ({
            ...prev,
            menuItems: prev.menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        }));
    };

    const handleToggleItemAvailability = (itemId: string) => {
        setData((prev) => ({
            ...prev,
            menuItems: prev.menuItems.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)),
        }));
    };

    if (isLoading) {
        return <Welcome />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <NavSecondary title="Panel de Administración" />

            {/* Body */}
            <AdminPanel
                orders={orders}
                menuItems={data.menuItems}
                categories={data.categories}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddMenuItem={handleAddMenuItem}
                onUpdateMenuItem={handleUpdateMenuItem}
                onToggleItemAvailability={handleToggleItemAvailability}
            />
        </div>
    );


}
