
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"

import { TYPE_PRODUCT } from "@/constants/type-product"
import { useCurrency } from "@/context/CurrencyContext"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

export default function CartButton() {
  
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { currency } = useCurrency()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="fixed lg:hidden bottom-52 right-[8%] z-50">

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >

        {/* BOTÓN FLOTANTE */}

        <DialogTrigger asChild>
          <Button
            className="
              relative
              rounded-full
              h-14 w-14
              shadow-lg
              bg-red-400
              hover:bg-red-500
              p-0
              flex
              items-center
              justify-center
              cursor-pointer
            "
          >
            <ShoppingCart className="h-6 w-6" />

            {cart.length > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-5
                  h-5
                  px-1
                  rounded-full
                  bg-primary
                  text-primary-foreground
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {cart.length}
              </span>
            )}
          </Button>
        </DialogTrigger>


        {/* MODAL */}

        <DialogContent
          className="
            bg-card
            text-card-foreground
            border-border
            w-[95vw]
            max-w-md
            max-h-[90vh]
            overflow-hidden
            flex
            flex-col
          "
        >

          <DialogHeader>
            <DialogTitle className="text-lg">
              Mi Pedido ({cart.length} items)
            </DialogTitle>

            <DialogDescription>
              Revisa los productos de tu pedido.
            </DialogDescription>
          </DialogHeader>


          {/* CARRITO */}

          {cart.length === 0 ? (

            <div className="py-8 text-center">

              <ShoppingCart
                className="
                  w-14
                  h-14
                  mx-auto
                  mb-4
                  text-muted-foreground
                "
              />

              <p className="text-muted-foreground font-medium">
                Tu carrito está vacío
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                Agrega algunos platos deliciosos
              </p>

            </div>

          ) : (

            <div className="flex flex-col min-h-0">

              {/* PRODUCTOS */}

              <div
                className="
                  space-y-3
                  overflow-y-auto
                  custom-scrollbar
                  pr-1
                  max-h-[50vh]
                "
              >

                {cart.map((item) => (

                  <div
                    key={item.idProduct}
                    className="
                      flex
                      flex-col
                      space-y-3
                      p-3
                      bg-muted/50
                      rounded-lg
                      border
                      border-border/50
                    "
                  >

                    {/* IMAGEN + INFORMACIÓN */}

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-16 h-16 shrink-0">

                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="
                            w-full
                            h-full
                            rounded-lg
                            object-contain
                          "
                        />

                      </div>


                      <div className="flex-1 min-w-0">

                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                          {item.name}
                        </h4>

                        <p className="text-base text-primary font-semibold">
                          {formatCurrency(
                            item.price,
                            currency!.code
                          )}
                        </p>

                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            Nota: {item.notes}
                          </p>
                        )}

                      </div>

                    </div>


                    {/* CANTIDAD + ELIMINAR */}

                    <div className="flex items-center justify-between">

                      <div className="flex items-center space-x-2">

                        {item.typeProduct?.id === TYPE_PRODUCT.SERVICE.id ? (

                          <span className="w-8 text-center text-foreground font-medium">
                            {item.quantity}
                          </span>

                        ) : (

                          <>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(
                                  item.idProduct,
                                  item.quantity - 1
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>

                            <span className="w-8 text-center text-foreground font-medium">
                              {item.quantity}
                            </span>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(
                                  item.idProduct,
                                  item.quantity + 1
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>

                          </>

                        )}

                      </div>


                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          removeFromCart(item.idProduct)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>

                    </div>

                  </div>

                ))}

              </div>


              {/* TOTAL */}

              <div
                className="
                  border-t
                  border-border
                  pt-4
                  mt-4
                  space-y-4
                "
              >

                <div className="flex justify-between items-center">

                  <span className="text-lg font-semibold text-foreground">
                    Total:
                  </span>

                  <p className="text-secondary-foreground text-lg font-semibold">
                    {formatCurrency(
                      total,
                      currency!.code
                    )}
                  </p>

                </div>


                <Button
                  onClick={() => {
                    setIsDialogOpen(false)
                    router.push("/checkout")
                  }}
                  className="
                    w-full
                    bg-accent
                    hover:bg-accent/90
                    text-accent-foreground
                    font-medium
                    py-3
                  "
                >
                  Proceder al Checkout
                </Button>

              </div>

            </div>

          )}

        </DialogContent>

      </Dialog>

    </div>
  )
}

