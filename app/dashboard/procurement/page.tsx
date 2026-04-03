"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { label: "Design", completed: true },
  { label: "Materials", completed: true },
  { label: "Suppliers", completed: false, current: true },
  { label: "Cart", completed: false },
  { label: "Payment", completed: false },
  { label: "Confirmation", completed: false },
]

const suppliers = [
  {
    material: "Aerogel Insulation Panel",
    supplier: "ThermalTech Solutions",
    availability: "In Stock",
    unitPrice: 82.5,
    quantity: 45,
  },
  {
    material: "High-Density Mineral Wool",
    supplier: "BuildRight Materials",
    availability: "In Stock",
    unitPrice: 30.0,
    quantity: 45,
  },
  {
    material: "Vapor Barrier Membrane",
    supplier: "SealPro Industries",
    availability: "Limited",
    unitPrice: 4.25,
    quantity: 50,
  },
  {
    material: "Fiber Cement Board",
    supplier: "CementWorks Co.",
    availability: "In Stock",
    unitPrice: 17.5,
    quantity: 45,
  },
  {
    material: "Fasteners & Adhesives Kit",
    supplier: "FastenAll Supply",
    availability: "In Stock",
    unitPrice: 115.0,
    quantity: 2,
  },
  {
    material: "Sealant & Tape Bundle",
    supplier: "SealPro Industries",
    availability: "In Stock",
    unitPrice: 42.0,
    quantity: 3,
  },
]

export default function ProcurementPage() {
  const [cart, setCart] = useState<
    { material: string; quantity: number; unitPrice: number }[]
  >([])
  const [quantities, setQuantities] = useState<Record<string, number>>(
    suppliers.reduce((acc, s) => ({ ...acc, [s.material]: s.quantity }), {})
  )

  const addToCart = (supplier: (typeof suppliers)[0]) => {
    const existingItem = cart.find((item) => item.material === supplier.material)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.material === supplier.material
            ? { ...item, quantity: quantities[supplier.material] }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          material: supplier.material,
          quantity: quantities[supplier.material],
          unitPrice: supplier.unitPrice,
        },
      ])
    }
  }

  const updateQuantity = (material: string, delta: number) => {
    setQuantities({
      ...quantities,
      [material]: Math.max(1, (quantities[material] || 1) + delta),
    })
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const shippingEstimate = cartTotal > 0 ? 250 : 0
  const grandTotal = cartTotal + shippingEstimate

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Procurement</h1>
        <p className="text-muted-foreground">
          Select suppliers and add materials to your cart
        </p>
      </div>

      {/* Stepper */}
      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : step.current
                        ? "border-2 border-primary bg-transparent text-primary"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1 text-xs",
                      step.current || step.completed
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-8 sm:w-16",
                      step.completed ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Supplier Table */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Available Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Material</TableHead>
                      <TableHead className="text-muted-foreground">Supplier</TableHead>
                      <TableHead className="text-muted-foreground">Availability</TableHead>
                      <TableHead className="text-right text-muted-foreground">Unit Price</TableHead>
                      <TableHead className="text-center text-muted-foreground">Quantity</TableHead>
                      <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.material} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {supplier.material}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {supplier.supplier}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              supplier.availability === "In Stock"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              supplier.availability === "In Stock"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-400"
                            }
                          >
                            {supplier.availability}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-foreground">
                          ${supplier.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(supplier.material, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              className="h-7 w-14 text-center"
                              value={quantities[supplier.material]}
                              readOnly
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(supplier.material, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => addToCart(supplier)}
                            className="gap-1"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        <div>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Cart Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.material}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.material.length > 20
                          ? item.material.substring(0, 20) + "..."
                          : item.material}
                      </span>
                      <span className="text-foreground">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    Shipping Estimate
                  </span>
                  <span className="text-foreground">
                    ${shippingEstimate.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button className="w-full" disabled={cart.length === 0}>
                Proceed to Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
