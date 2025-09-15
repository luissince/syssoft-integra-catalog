"use client";
import { useState, useEffect, use } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import restaurantData from "@/data/restaurant-data.json";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { OrderCompletion } from "@/components/OrderCompletion";
import { NavSecondary } from "@/components/Nav";
import { Branch, Company, Order, Tax, TypeDocument } from "@/types/api-type";
import Welcome from "./Welcome";
import { FormOrder } from "@/types/form";
import { createOrder, getOrderById } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { useAlert } from "@/hooks/use-alert";

interface CheckoutProps {
    company: Company;
    branch: Branch;
    branches: Branch[];
    tax: Tax;
    listTypeDocument: TypeDocument[];
    authEnabled: boolean;
}

export default function CheckoutComponent({ company, branch, branches, tax, listTypeDocument ,authEnabled }: CheckoutProps) {
    const router = useRouter()
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

    const [isMounted, setIsMounted] = useState(false);

    const { cart, clearCart } = useCart();
    const { currency } = useCurrency();
    const alert = useAlert();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmitOrder = async (formOrder: FormOrder) => {
        alert.loading({
            message: "Procesando pedido...",
        });

        const { status, idOrder, message } = await createOrder(formOrder);

        if (!status) {
            alert.error({
                message: message,
            });
            return;
        }

        const order = await getOrderById(idOrder!);

        alert.close(() => {
            setCompletedOrder(order);
            clearCart();
        });
    };

    if (!isMounted) {
        return <Welcome company={company} branch={branch} />;
    }

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
            <NavSecondary authEnabled={authEnabled} />

            {/* Body */}
            <div className="container mx-auto p-4">
                <CheckoutForm
                    listTypeDocument={listTypeDocument}
                    branches={branches}
                    tax={tax}
                    currency={currency}
                    cart={cart}
                    paymentMethods={restaurantData.paymentMethods}
                    onSubmitOrder={handleSubmitOrder}
                    onBack={() => router.push("/")}
                />
            </div>
        </div>
    );
}
