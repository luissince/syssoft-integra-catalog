import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, Package, Truck, Home } from "lucide-react"
import type { CartItem, PaymentMethod, DeliveryZone, Order, Customer, Address } from "@/types"
import customers from "@/data/customer.json";

interface CheckoutFormProps {
  isAuthenticated: boolean
  user: Customer
  cart: CartItem[]
  paymentMethods: PaymentMethod[]
  deliveryZones: DeliveryZone[]
  onSubmitOrder: (orderData: any) => void
  onBack: () => void
}

export function CheckoutForm({ isAuthenticated, user, cart, paymentMethods, deliveryZones, onSubmitOrder, onBack }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    id: user?.id || "",
    document: user?.document || "",
    name: user?.name || "",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    address: user?.addresses.find(addr => addr.isDefault)?.address || "",
    reference: user?.addresses.find(addr => addr.isDefault)?.reference || "",
    paymentMethod: "",
    deliveryZone: "",
    deliveryType: "delivery", // Nuevo campo para el tipo de entrega
    notes: "",
    orderType: "now",
    scheduledDate: "",
    scheduledTime: "",
    orderNotes: "",
    discount: "0",
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountPercentage = parseFloat(formData.discount) || 0
  const discountedSubtotal = subtotal * (1 - discountPercentage / 100)
  const selectedZone = deliveryZones.find((zone) => zone.id === formData.deliveryZone)
  const deliveryFee = formData.deliveryType === "delivery" ? (selectedZone?.price || 0) : 0
  const total = discountedSubtotal + deliveryFee

  useEffect(() => {
    if (isAuthenticated && user) {
      const address = user.addresses.find(addr => addr.isDefault) || user.addresses[0]
      setFormData((prev) => ({
        ...prev,
        id: user.id || "",
        document: user.document || "",
        name: user.name || "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || "",
        address: address?.address || "",
        reference: address?.reference || "",
      }))
    }
  }, [isAuthenticated, user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const customer = customers.list.find(item => item.id === formData.id)
    const address: Address = {
      id: "",
      address: formData.address,
      reference: formData.reference,
      isDefault: true,
      createdAt: new Date().toISOString(),
    }

    const orderData = {
      id: Date.now().toString(),
      items: cart,
      customerId: customer?.id,
      payment: {
        method: formData.paymentMethod,
        total,
        deliveryFee,
        discount: discountPercentage,
      },
      delivery: {
        type: formData.deliveryType,
        address: formData.deliveryType === "delivery" ? address : null,
        zone: formData.deliveryType === "delivery" ? selectedZone : null,
        time: formData.deliveryType === "delivery" ? (selectedZone?.time || "") : "",
        orderType: formData.orderType,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
      },
      status: "pending" as const,
      notes: formData.notes,
      discount: formData.discount,
      orderNotes: formData.orderNotes,
      createdAt: new Date().toISOString(),
    } as Order

    onSubmitOrder(orderData)
  }

  const isFormValid =
    formData.document &&
    formData.name &&
    formData.phone &&
    formData.whatsapp &&
    (formData.deliveryType === "delivery" ? formData.address && formData.deliveryZone : true) &&
    formData.paymentMethod &&
    (formData.orderType === "now" || (formData.scheduledDate && formData.scheduledTime))

  const timeSlots = []
  for (let hour = 10; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      timeSlots.push(timeString)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground font-display text-xl">Información de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Entrega */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Tipo de Entrega</h3>
              <RadioGroup
                value={formData.deliveryType}
                onValueChange={(value) => setFormData({ ...formData, deliveryType: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="text-foreground flex items-center cursor-pointer">
                    <Truck className="w-4 h-4 mr-2 text-primary" />
                    Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="local" id="local" />
                  <Label htmlFor="local" className="text-foreground flex items-center cursor-pointer">
                    <Home className="w-4 h-4 mr-2 text-primary" />
                    Recojo en Local
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Información del cliente */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Datos del Cliente</h3>
              <div>
                <Label htmlFor="name" className="text-foreground font-medium">
                  N° de Documento *
                </Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  className="bg-muted border-border text-foreground mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-foreground font-medium">
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-muted border-border text-foreground mt-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-muted border-border text-foreground mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-foreground font-medium">
                    WhatsApp *
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="bg-muted border-border text-foreground mt-2"
                    placeholder="Ej: +51999888777"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            {formData.deliveryType === "delivery" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground font-display">Dirección de Entrega</h3>
                <div>
                  <Label htmlFor="address" className="text-foreground font-medium">
                    Dirección *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-muted border-border text-foreground mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reference" className="text-foreground font-medium">
                    Referencia
                  </Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="bg-muted border-border text-foreground mt-2"
                    placeholder="Ej: Casa azul, portón negro"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-medium">Zona de entrega *</Label>
                  <Select
                    value={formData.deliveryZone}
                    onValueChange={(value) => setFormData({ ...formData, deliveryZone: value })}
                  >
                    <SelectTrigger className="bg-muted border-border text-foreground mt-2">
                      <SelectValue placeholder="Selecciona tu zona" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {deliveryZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id} className="text-foreground">
                          {zone.name} - S/. {zone.price.toFixed(2)} ({zone.time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Tipo de pedido */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Tipo de Pedido</h3>
              <RadioGroup
                value={formData.orderType}
                onValueChange={(value) => setFormData({ ...formData, orderType: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="text-foreground flex items-center cursor-pointer">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Entregar ahora
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="text-foreground flex items-center cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    Programar entrega
                  </Label>
                </div>
              </RadioGroup>
              {formData.orderType === "scheduled" && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label htmlFor="scheduledDate" className="text-foreground font-medium">
                      Fecha *
                    </Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      min={new Date().toISOString().split("T")[0]}
                      required={formData.orderType === "scheduled"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime" className="text-foreground font-medium">
                      Hora *
                    </Label>
                    <Select
                      value={formData.scheduledTime}
                      onValueChange={(value) => setFormData({ ...formData, scheduledTime: value })}
                    >
                      <SelectTrigger className="bg-muted border-border text-foreground mt-2">
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-48">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-foreground">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Descuento */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Descuento</h3>
              <div>
                <Label htmlFor="discount" className="text-foreground font-medium">
                  Porcentaje de Descuento
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="bg-muted border-border text-foreground mt-2"
                  placeholder="Ej: 10"
                />
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Método de Pago</h3>
              <p className="text-sm text-muted-foreground">
                Los pagos son referenciales. Aún no se aceptan pagos en línea. Al momento de recoger su pedido, se le proporcionará toda la información necesaria para realizar el pago.
              </p>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                className="space-y-3"
              >
                {paymentMethods
                  .filter((method) => method.available)
                  .map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="text-foreground flex items-center cursor-pointer">
                        <span className="mr-2 text-lg">{method.icon}</span>
                        {method.name}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </div>

            {/* Notas del pedido */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Información Adicional</h3>
              <div>
                <Label htmlFor="orderNotes" className="text-foreground font-medium">
                  Notas sobre el pedido
                </Label>
                <Textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground mt-2"
                  placeholder="Ej: Incluye salsas extra, sin picante, para celebración..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-foreground font-medium">
                  Instrucciones de entrega
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground mt-2"
                  placeholder="Instrucciones especiales para la entrega..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Volver
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Confirmar Pedido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground font-display text-xl">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <p className="text-foreground font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                  {item.notes && <p className="text-xs text-primary mt-1">Nota: {item.notes}</p>}
                </div>
                <span className="text-primary font-bold font-display">
                  S/. {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between text-foreground">
              <span>Subtotal:</span>
              <span>S/. {subtotal.toFixed(2)}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="flex justify-between text-foreground">
                <span>Descuento ({discountPercentage}%):</span>
                <span>-S/. {(subtotal * discountPercentage / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-foreground">
              <span>Subtotal con descuento:</span>
              <span>S/. {discountedSubtotal.toFixed(2)}</span>
            </div>
            {formData.deliveryType === "delivery" && (
              <div className="flex justify-between text-foreground">
                <span>Delivery:</span>
                <span>S/. {deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-border font-display">
              <span>Total:</span>
              <span>S/. {total.toFixed(2)}</span>
            </div>
          </div>
          {/* Información de entrega */}
          <div className="space-y-3 pt-4 border-t border-border">
            {formData.deliveryType === "delivery" && selectedZone && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                <div className="flex items-center mb-2">
                  <Package className="w-4 h-4 text-primary mr-2" />
                  <span className="font-medium text-foreground">Información de entrega</span>
                </div>
                <p className="text-foreground text-sm">
                  <strong>Tiempo estimado:</strong> <span className="text-primary">{selectedZone.time}</span>
                </p>
                {formData.orderType === "scheduled" && formData.scheduledDate && formData.scheduledTime && (
                  <p className="text-foreground text-sm">
                    <strong>Entrega programada:</strong>{" "}
                    <span className="text-primary">
                      {new Date(formData.scheduledDate).toLocaleDateString()} a las {formData.scheduledTime}
                    </span>
                  </p>
                )}
              </div>
            )}
            {formData.deliveryType === "local" && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                <div className="flex items-center mb-2">
                  <Home className="w-4 h-4 text-primary mr-2" />
                  <span className="font-medium text-foreground">Recojo en Local</span>
                </div>
                <p className="text-foreground text-sm">
                  <strong>Dirección:</strong> <span className="text-primary">[Dirección del local]</span>
                </p>
                {formData.orderType === "scheduled" && formData.scheduledDate && formData.scheduledTime && (
                  <p className="text-foreground text-sm">
                    <strong>Recojo programado:</strong>{" "}
                    <span className="text-primary">
                      {new Date(formData.scheduledDate).toLocaleDateString()} a las {formData.scheduledTime}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
