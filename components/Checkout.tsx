"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderCompletion } from "@/components/OrderCompletion";

import { useCart } from "@/context/CartContext";
import { useBranch } from "@/context/BranchContext";

import {
    Agency,
    Order,
    PaymentReceipt,
    Person,
    Tax,
} from "@/types/api-type";

import { FormOrder } from "@/types/form";

import { useAlert } from "@/hooks/use-alert";

import { PageBreadcrumb } from "./PageBreadcrumb";
import Container from "./Container";
import Welcome from "./Welcome";

import {
    fetchCreateOrder,
    fetchGetOrder,
    fetchPaymentReceipts,
} from "@/data/data-rest";

interface CheckoutProps {
    taxes: Tax[];
    person: Person;
    agencies: Agency[];
}

export default function CheckoutComponent({
    taxes,
    person,
    agencies,
}: CheckoutProps) {

    const router = useRouter();
    const alert = useAlert();

    const { cart, clearCart } = useCart();
    const { branch } = useBranch();

    const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
    const [loadingReceipts, setLoadingReceipts] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<Order>();

    /*
     * 1. Primero verificamos el carrito.
     */
    useEffect(() => {

        if (completedOrder) {
            return;
        }

        if (cart.length === 0) {
            setRedirecting(true);
            router.replace("/");
        }

    }, [cart.length, completedOrder, router]);


    /*
     * 2. Si tenemos una sucursal válida,
     *    cargamos sus comprobantes.
     */
    useEffect(() => {

        if (cart.length === 0) {
            return;
        }

        let cancelled = false;

        const loadReceipts = async () => {

            setLoadingReceipts(true);

            const result = await fetchPaymentReceipts(
                branch.idBranch
            );

            if (cancelled) {
                return;
            }

            if (!result.success) {

                alert.error({
                    message: result.message,
                });

                setLoadingReceipts(false);

                return;
            }

            setReceipts(result.data ?? []);

            setLoadingReceipts(false);
        };

        loadReceipts();

        return () => {
            cancelled = true;
        };

    }, [branch.idBranch, cart.length]);


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

        const orderResult = await fetchGetOrder(
            createOrderResult.data?.idPedido!
        );

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


    /*
     * Mientras se valida el carrito
     * o se cargan los comprobantes.
     */
    if (redirecting || loadingReceipts) {
        return <Welcome />;
    }


    /*
     * Pedido completado.
     */
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


    /*
     * Checkout normal.
     */
    return (
        <Container>

            <PageBreadcrumb
                items={[
                    {
                        label: "Inicio",
                        href: "/",
                    },
                    {
                        label: "Checkout",
                    },
                ]}
            />

            <CheckoutForm
                taxes={taxes}
                receipts={receipts}
                person={person}
                agencies={agencies}
                onSubmitOrder={handleSubmitOrder}
            />

        </Container>
    );
}