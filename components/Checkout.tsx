// components/Checkout.tsx
"use client";

import { useState } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import restaurantData from "@/data/restaurant-data.json";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { OrderCompletion } from "@/components/OrderCompletion";
import { Branch, Order } from "@/types/api-type";
import { FormOrder } from "@/types/form";
import { createOrder } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { useAlert } from "@/hooks/use-alert";
import { PageBreadcrumb } from "./PageBreadcrumb";
import Container from "./Container";
import { useAuth } from "@/context/AuthContext";

interface CheckoutProps {
    branch: Branch;
    branches: Branch[];
}

export default function CheckoutComponent({ branch, branches }: CheckoutProps) {
    const router = useRouter()
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

    const { isAuthenticated, logout } = useAuth();
    const { cart, clearCart } = useCart();
    const { currency } = useCurrency();
    const alert = useAlert();

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

        // const order = await getOrderById(idOrder!);

        // alert.close(() => {
        //     setCompletedOrder(order);
        //     clearCart();
        // });
    };

    if (!isAuthenticated) {
        router.push("/");
        return null;
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
        <Container>
            {/* Breadcrumb */}
            <PageBreadcrumb
                items={[
                    { label: "Inicio", href: "/" },
                    { label: "Checkout" },
                ]}
            />

            {/* Body */}
            <CheckoutForm
                branch={branch}
                branches={branches}
                currency={currency}
                cart={cart}
                onSubmitOrder={handleSubmitOrder}
            />
        </Container>
    );
}
