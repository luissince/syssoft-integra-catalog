// components/Checkout.tsx
"use client";

import { useEffect, useState } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { OrderCompletion } from "@/components/OrderCompletion";
import { Agency, Branch, Order, PaymentReceipt, Person, Tax } from "@/types/api-type";
import { FormOrder } from "@/types/form";
import { useAlert } from "@/hooks/use-alert";
import { PageBreadcrumb } from "./PageBreadcrumb";
import Container from "./Container";
import { fetchCreateOrder, fetchGetOrder } from "@/data/data-rest";
import Welcome from "./Welcome";

interface CheckoutProps {
    taxes: Tax[];
    branch: Branch;
    branches: Branch[];
    receipts: PaymentReceipt[];
    person: Person
    agencies: Agency[]
}

export default function CheckoutComponent({ taxes, branch, branches, receipts, person, agencies }: CheckoutProps) {
    const router = useRouter()
    const [completedOrder, setCompletedOrder] = useState<Order>();
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);

    const { cart, clearCart } = useCart();
    const alert = useAlert();

    useEffect(() => {
        if (completedOrder) return;


        if (cart.length === 0) {
            setRedirecting(true);
            router.replace("/");
            return;
        }

        setLoading(false);
    }, [cart.length, completedOrder, router]);

    const handleSubmitOrder = async (formOrder: FormOrder) => {
        alert.loading({
            message: "Procesando pedido...",
        });

        const createOrderResult = await fetchCreateOrder(formOrder);

        if (!createOrderResult.success) {
            alert.error({
                message: createOrderResult.message,
            });
            return;
        }

        const orderResult = await fetchGetOrder(createOrderResult.data?.idPedido!);

        if (!orderResult.success) {
            alert.error({
                message: orderResult.message,
            });
            return;
        }

        alert.close(() => {
            setCompletedOrder(orderResult.data);
            clearCart();
        });
    };

    // Mientras valida carrito o está redireccionando
    if (loading || redirecting) {
        return <Welcome />;
    }

    // Pedido completado
    if (completedOrder) {
        return (
            <Container>
                <OrderCompletion
                    order={completedOrder}
                    onBackToMenu={() => router.push("/")}
                />
            </Container>
        );
    }

    // Checkout normal
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
                taxes={taxes}
                branch={branch}
                branches={branches}
                receipts={receipts}
                person={person}
                agencies={agencies}
                onSubmitOrder={handleSubmitOrder}
            />
        </Container>
    );
}
