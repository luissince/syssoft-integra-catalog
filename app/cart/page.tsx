'use client';

import Container from "@/components/Container";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { ShoppingBag, ReceiptText, ClipboardList } from "lucide-react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useCart();
    const { currency } = useCurrency();

    const currencyCode = currency?.code ?? "PEN";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <Container>
            <PageBreadcrumb
                items={[
                    {
                        label: "Inicio",
                        href: "/",
                    },
                    {
                        label: "Pedido",
                    },
                ]}
            />

            {/* Encabezado */}
            <div className="mb-6 flex items-center gap-3 py-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-xl font-bold text-foreground md:text-2xl">
                        Mi pedido
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Revisa los productos de tu pedido
                    </p>
                </div>
            </div>

            {cart.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center">
                    <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                    <h2 className="font-semibold text-foreground">
                        Tu pedido está vacío
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Agrega productos para comenzar tu pedido.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_350px] md:items-start">
                    {/* Lista de productos */}
                    <section className="min-w-0 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-foreground">
                                Productos
                            </h2>

                            <span className="text-sm text-muted-foreground">
                                {cart.length} {cart.length === 1 ? "producto" : "productos"}
                            </span>
                        </div>

                        {cart.map((item, index) => (
                            <article
                                key={`${item.name}-${item.measure?.name ?? ""}-${index}`}
                                className="flex gap-3 rounded-2xl border border-border bg-card p-3 sm:gap-4 sm:p-4"
                            >
                                {/* Imagen */}
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
                                    <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Información */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                    <div>
                                        <h3 className="line-clamp-2 font-medium text-foreground">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {formatCurrency(item.price, currencyCode)} x {item.measure?.name ?? "Unidad"}
                                        </p>

                                        {item.notes && (
                                            <p className="mt-1 break-words text-xs text-muted-foreground">
                                                <span className="font-medium text-foreground">
                                                    Nota:
                                                </span>{" "}
                                                {item.notes}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-end justify-between gap-2">
                                        <div className="text-sm text-muted-foreground">
                                            Cantidad: {item.quantity}
                                        </div>

                                        <p className="font-bold text-primary">
                                            {formatCurrency(
                                                item.price * item.quantity,
                                                currencyCode
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Resumen */}
                    <aside className="rounded-2xl border border-border bg-card p-5 md:sticky md:top-32">
                        <div className="mb-4 flex items-center gap-2">
                            <ReceiptText className="h-5 w-5 text-primary" />

                            <h2 className="font-semibold text-foreground">
                                Resumen del pedido
                            </h2>
                        </div>

                        <div className="space-y-3 border-b border-border pb-4">
                            <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                                <span>Productos</span>
                                <span>{cart.length}</span>
                            </div>

                            <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>
                                    {formatCurrency(total, currencyCode)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-4">
                            <span className="font-semibold text-foreground">
                                Total
                            </span>

                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(total, currencyCode)}
                            </span>
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground mb-4">
                            El costo de envío, si corresponde, puede calcularse por separado.
                        </p>

                        <Button
                            onClick={() => {
                                router.push("/checkout")
                            }}
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3"
                        >
                            Proceder al Checkout
                        </Button>
                    </aside>
                </div>
            )}
        </Container>
    );
}