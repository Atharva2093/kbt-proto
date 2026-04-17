"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

const steps = [
  { label: "Design", completed: true },
  { label: "Materials", completed: true },
  { label: "Suppliers", completed: false, current: true },
  { label: "Review", completed: false },
  { label: "Order", completed: false },
]

export default function ProcurementPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [data, setData] = useState<any>(null)
  
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      if (!user || !projectId) {
        setLoading(false)
        return
      }
      try {
        const token = await user.getIdToken()
        const res = await fetch(`/api/procurement?projectId=${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        const json = await res.json()
        
        if (!controller.signal.aborted) {
          setData(json)
          setCart(json.items || [])
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error("Failed to load procurement data")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => controller.abort();
  }, [user, projectId])

  const handleGenerate = async () => {
    if (!user || !projectId) return
    setActing(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/procurement", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          projectId,
          items: cart,
          totalCost: cartTotal
        })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData({ ...data, status: "GENERATED" })
      toast.success("Procurement list generated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to generate procurement")
    } finally {
      setActing(false)
    }
  }

  const handleOrder = async () => {
    if (!user || !projectId) return
    setActing(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/procurement/order", {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ projectId })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData({ ...data, status: "ORDERED", orderDate: new Date().toISOString() })
      toast.success("Order placed successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to place order")
    } finally {
      setActing(false)
    }
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.totalCostNum || 0),
    0
  )
  const shippingEstimate = cartTotal > 0 ? 250 : 0
  const grandTotal = cartTotal + shippingEstimate

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">No Project Selection</h2>
        <p className="text-muted-foreground">Select a project to view procurement details.</p>
      </div>
    )
  }

  const isOrdered = data.status === "ORDERED"
  const isGenerated = data.status === "GENERATED" || isOrdered

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Procurement</h1>
          <p className="text-muted-foreground">
            Manage material procurement for your project
          </p>
        </div>
        {isOrdered && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 py-1 px-3">
                <CheckCircle className="mr-2 h-4 w-4" />
                Ordered on {new Date(data.orderDate).toLocaleDateString()}
            </Badge>
        )}
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
                      (isOrdered && i < steps.length) || (isGenerated && i < 4) || step.completed
                        ? "bg-primary text-primary-foreground"
                        : step.current
                        ? "border-2 border-primary bg-transparent text-primary"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {(isOrdered && i < steps.length) || (isGenerated && i < 4) || step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1 text-xs",
                      step.current || step.completed || (isGenerated && i < 4) || (isOrdered)
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
                      (isOrdered && i < steps.length - 1) || (isGenerated && i < 3) || step.completed ? "bg-primary" : "bg-border"
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
              <CardTitle className="text-lg">Calculated Material Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Material</TableHead>
                      <TableHead className="text-muted-foreground">Availability</TableHead>
                      <TableHead className="text-right text-muted-foreground">Unit Price</TableHead>
                      <TableHead className="text-center text-muted-foreground">Quantity</TableHead>
                      <TableHead className="text-right text-muted-foreground">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item, idx) => (
                      <TableRow key={idx} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className="bg-emerald-500/20 text-emerald-400 border-none"
                          >
                            Calculated
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-foreground">
                          {item.unitCost}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm">{item.quantity}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {item.totalCost}
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
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cart.map((item, idx) => (
                <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                >
                    <span className="text-muted-foreground">
                    {item.name.length > 20
                        ? item.name.substring(0, 20) + "..."
                        : item.name}
                    </span>
                    <span className="text-foreground">
                    {item.totalCost}
                    </span>
                </div>
                ))}
              </div>

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
                    ${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {!isGenerated ? (
                    <Button 
                        className="w-full" 
                        onClick={handleGenerate} 
                        disabled={acting}
                    >
                        {acting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Procurement"}
                    </Button>
                ) : !isOrdered ? (
                    <Button 
                        className="w-full bg-primary" 
                        onClick={handleOrder}
                        disabled={acting}
                    >
                        {acting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Proceed to Order"}
                    </Button>
                ) : (
                    <Button className="w-full bg-secondary text-muted-foreground" disabled>
                        <Clock className="mr-2 h-4 w-4" />
                        Ordered
                    </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
