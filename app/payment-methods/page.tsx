"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Copy,
    Check,
    CreditCard,
    Smartphone,
    Building2,
    Banknote,
    QrCode
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NavSecondary } from "@/components/Nav";

interface PaymentMethodsPageProps {
    authEnabled: boolean;
}

export default function PaymentMethodsPage({ authEnabled }: PaymentMethodsPageProps) {
    const router = useRouter();
    const [copiedText, setCopiedText] = useState<string | null>(null);

    // Función para copiar al portapapeles
    const handleCopy = async (text: string, identifier: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(identifier);
            setTimeout(() => setCopiedText(null), 2000);
        } catch (err) {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedText(identifier);
            setTimeout(() => setCopiedText(null), 2000);
        }
    };

    // Datos de ejemplo - puedes modificar estos
    const paymentMethods = {
        digital: [
            {
                id: 'yape',
                name: 'Yape',
                number: '987-654-321',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50 dark:bg-purple-950/20',
                borderColor: 'border-purple-200 dark:border-purple-800',
                icon: '📱',
                description: 'Transferencia instantánea'
            },
            {
                id: 'plin',
                name: 'Plin',
                number: '987-654-321',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-950/20',
                borderColor: 'border-blue-200 dark:border-blue-800',
                icon: '💳',
                description: 'Pago digital rápido'
            },
            {
                id: 'lukita',
                name: 'Lukita',
                number: '987-654-321',
                color: 'text-green-600',
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-green-200 dark:border-green-800',
                icon: '🟢',
                description: 'Transferencia móvil'
            }
        ],
        banks: [
            {
                id: 'bcp',
                name: 'Banco de Crédito del Perú (BCP)',
                account: '191-12345678-1-23',
                cci: '00219111234567812345',
                color: 'text-blue-800',
                bgColor: 'bg-blue-50 dark:bg-blue-950/20',
                borderColor: 'border-blue-200 dark:border-blue-800',
                icon: '🏦'
            },
            {
                id: 'interbank',
                name: 'Interbank',
                account: '123-4567890123',
                cci: '00300012345678901234',
                color: 'text-green-700',
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-green-200 dark:border-green-800',
                icon: '🏛️'
            },
            {
                id: 'bbva',
                name: 'BBVA',
                account: '001-2345678901',
                cci: '01100012345678901234',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-950/20',
                borderColor: 'border-blue-200 dark:border-blue-800',
                icon: '🏪'
            }
        ],
        cards: [
            { name: 'Visa', icon: '💳', color: 'text-blue-700' },
            { name: 'Mastercard', icon: '💳', color: 'text-orange-600' },
            { name: 'American Express', icon: '💳', color: 'text-blue-600' }
        ],
        cash: {
            available: true,
            note: 'Pago contra entrega disponible'
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <NavSecondary title="Métodos de Pago" authEnabled={authEnabled} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8">

                    {/* Pagos Digitales */}
                    <section>
                        <div className="flex items-center mb-6">
                            <Smartphone className="w-5 h-5 text-primary mr-3" />
                            <h2 className="text-xl font-semibold text-foreground">Pagos Digitales</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paymentMethods.digital.map((method) => (
                                <Card key={method.id} className={`${method.borderColor} ${method.bgColor}`}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className={`flex items-center text-lg ${method.color}`}>
                                            <span className="text-2xl mr-3">{method.icon}</span>
                                            {method.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground">{method.description}</p>
                                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium">Número:</p>
                                                    <p className="font-mono text-lg">{method.number}</p>
                                                </div>
                                                <Button
                                                    onClick={() => handleCopy(method.number.replace(/-/g, ''), method.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center"
                                                >
                                                    {copiedText === method.id ? (
                                                        <>
                                                            <Check className="w-4 h-4 mr-2 text-green-600" />
                                                            ¡Copiado!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Copiar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Cuentas Bancarias */}
                    <section>
                        <div className="flex items-center mb-6">
                            <Building2 className="w-5 h-5 text-primary mr-3" />
                            <h2 className="text-xl font-semibold text-foreground">Cuentas Bancarias</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {paymentMethods.banks.map((bank) => (
                                <Card key={bank.id} className={`${bank.borderColor} ${bank.bgColor}`}>
                                    <CardHeader>
                                        <CardTitle className={`flex items-center ${bank.color}`}>
                                            <span className="text-2xl mr-3">{bank.icon}</span>
                                            {bank.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Número de Cuenta */}
                                            <div className="p-3 bg-background/50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-muted-foreground">Número de Cuenta:</p>
                                                        <p className="font-mono text-lg font-semibold">{bank.account}</p>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleCopy(bank.account, `${bank.id}-account`)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {copiedText === `${bank.id}-account` ? (
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* CCI */}
                                            <div className="p-3 bg-background/50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-muted-foreground">CCI (Código Cuenta Interbancario):</p>
                                                        <p className="font-mono text-base font-semibold break-all">{bank.cci}</p>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleCopy(bank.cci, `${bank.id}-cci`)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {copiedText === `${bank.id}-cci` ? (
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Tarjetas de Crédito/Débito */}
                    <section>
                        <div className="flex items-center mb-6">
                            <CreditCard className="w-5 h-5 text-primary mr-3" />
                            <h2 className="text-xl font-semibold text-foreground">Tarjetas de Crédito y Débito</h2>
                        </div>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {paymentMethods.cards.map((card, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                                            <span className="text-2xl">{card.icon}</span>
                                            <span className={`font-medium ${card.color}`}>{card.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Efectivo */}
                    <section>
                        <div className="flex items-center mb-6">
                            <Banknote className="w-5 h-5 text-primary mr-3" />
                            <h2 className="text-xl font-semibold text-foreground">Pago en Efectivo</h2>
                        </div>
                        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <Banknote className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                            Pago Contra Entrega
                                        </h3>
                                        <p className="text-green-700 dark:text-green-300 mb-3">
                                            {paymentMethods.cash.note}
                                        </p>
                                        <div className="text-sm text-green-600 dark:text-green-400">
                                            <p>✓ Sin comisiones adicionales</p>
                                            <p>✓ Pago al momento de recibir tu pedido</p>
                                            <p>✓ Cambio exacto recomendado</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Información Adicional */}
                    <section className="bg-muted/20 rounded-lg p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center">
                            <QrCode className="w-5 h-5 mr-2 text-primary" />
                            Información Importante
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                <h4 className="font-medium text-foreground mb-2">Pagos Digitales:</h4>
                                <ul className="space-y-1">
                                    <li>• Confirma tu pedido enviando captura del pago</li>
                                    <li>• Transferencias inmediatas las 24 horas</li>
                                    <li>• Sin comisiones adicionales</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground mb-2">Transferencias Bancarias:</h4>
                                <ul className="space-y-1">
                                    <li>• Usa el CCI para transferencias desde otros bancos</li>
                                    <li>• Envía comprobante de pago por WhatsApp</li>
                                    <li>• Procesamiento en horario bancario</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Botón de Contacto */}
                    <div className="text-center">
                        <Button
                            onClick={() => router.back()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                        >
                            Realizar Pedido
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                            ¿Tienes dudas? Contáctanos por WhatsApp
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}