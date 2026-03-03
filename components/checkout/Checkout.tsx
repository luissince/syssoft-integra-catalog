"use client";
// Este componente maneja el flujo de checkout: formulario, confirmación y manejo de pedidos.

import { useState, useEffect } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { OrderCompletion } from "@/components/OrderCompletion";
import { NavSecondary } from "@/components/Nav";
import { Branch, Company, Order, Tax, TypeDocument } from "@/types/api-type";
import Welcome from "../Welcome";
import { FormOrder } from "@/types/form";
import { createOrder, getOrderById } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { useAlert } from "@/hooks/use-alert";
import { TYPE_PAYMENT_METHOD_LIST } from "@/constants/type-payment-method";

interface CheckoutProps {
    company: Company;
    branch: Branch;
    branches: Branch[];
    tax: Tax;
    listTypeDocument: TypeDocument[];
    authEnabled: boolean;
}

export default function CheckoutComponent({
    company,
    branch,
    branches,
    tax,
    listTypeDocument,
    authEnabled,
}: CheckoutProps) {
    // Hooks de Next.js y React
    const router = useRouter();
    // Estado para manejar el pedido completado y el montaje del componente
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    // Obtiene el carrito y la moneda del contexto
    const { cart, clearCart } = useCart();
    const { currency } = useCurrency();
    const alert = useAlert();

    // Efecto para marcar el componente como montado
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Efecto para redirigir a la página principal si el carrito está vacío
    // y NO hay un pedido completado
    useEffect(() => {
        if (isMounted && !completedOrder && (!cart || cart.length === 0)) {
            router.push("/");
        }
    }, [isMounted, cart, router, completedOrder]);

    /**
     * Maneja el envío del formulario de pedido:
     * - Muestra un alert de carga
     * - Crea el pedido y obtiene su ID
     * - Si hay error, muestra un mensaje de error
     * - Si es exitoso, obtiene el pedido y lo guarda en el estado
     * - Limpia el carrito
     */
    const handleSubmitOrder = async (formOrder: FormOrder) => {
        try {
            // Muestra alerta de carga
            alert.loading({
                message: "Procesando pedido...",
            });

            // 1. Crea el pedido
            const { status: createStatus, idOrder, message: createMessage } = await createOrder(formOrder);
            if (!createStatus || !idOrder) {
                throw new Error(createMessage || "Error al crear el pedido");
            }

            // 2. Obtiene el pedido recién creado
            const { status: fetchStatus, order, message: fetchMessage } = await getOrderById(idOrder);
            if (!fetchStatus || !order) {
                throw new Error(fetchMessage || "Error al obtener el pedido");
            }

            // 3. Actualiza el estado y limpia el carrito
            alert.close(() => {
                setCompletedOrder(order);
                clearCart();
            });
        } catch (error) {
            // Maneja errores de forma centralizada
            alert.error({
                message: error instanceof Error ? error.message : "Ocurrió un error inesperado",
            });
        }
    };

    // Renderiza el componente Welcome mientras el componente no está montado
    if (!isMounted) {
        return <Welcome company={company} branch={branch} />;
    }

    // Renderiza la confirmación del pedido si existe un pedido completado
    if (completedOrder) {
        return (
            <OrderCompletion
                order={completedOrder}
                company={company}
                branch={branch}
                onBackToMenu={() => router.push("/")}
            />
        );
    }

    // Renderiza el formulario de checkout si todo está listo
    return (
        <div className="min-h-screen bg-background">
            {/* Barra de navegación secundaria */}
            <NavSecondary authEnabled={authEnabled} />
            {/* Contenido principal: formulario de checkout */}
            <div className="container mx-auto py-4">
                <CheckoutForm
                    listTypeDocument={listTypeDocument}
                    branches={branches}
                    tax={tax}
                    currency={currency}
                    cart={cart}
                    paymentMethods={TYPE_PAYMENT_METHOD_LIST}
                    onSubmitOrder={handleSubmitOrder}
                />
            </div>
        </div>
    );
}
