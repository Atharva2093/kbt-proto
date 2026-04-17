"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, Send, TrendingDown, DollarSign, Clock, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function MaterialsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function fetchProcurement() {
      if (!user || !projectId) {
          setLoading(false)
          return
      }
      try {
        const token = await user.getIdToken()
        const res = await fetch(`/api/procurement?projectId=${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        setData(json)
      } catch (err: any) {
        toast.error("Failed to load material requirements")
      } finally {
        setLoading(false)
      }
    }
    fetchProcurement()
  }, [user, projectId])

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
        <DollarSign className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">No Procurement Data</h2>
        <p className="text-muted-foreground">Please run a thermal analysis first to generate material requirements.</p>
        <Link href="/dashboard/thermal-analysis">
            <Button className="mt-6">Go to Analysis</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Material List</h1>
        <p className="text-muted-foreground">
          Complete material requirements for your optimized wall design
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Materials Table */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Required Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Layer</TableHead>
                      <TableHead className="text-muted-foreground">Material Name</TableHead>
                      <TableHead className="text-muted-foreground">Quantity</TableHead>
                      <TableHead className="text-right text-muted-foreground">Unit Cost</TableHead>
                      <TableHead className="text-right text-muted-foreground">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((material: any, i: number) => (
                      <TableRow key={i} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {material.layer}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {material.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {material.quantity}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {material.unitCost}
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {material.totalCost}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-border bg-secondary/30">
                      <TableCell colSpan={4} className="font-semibold text-foreground">
                        Total Material Cost
                      </TableCell>
                      <TableCell className="text-right text-lg font-bold text-primary">
                        ${data.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Cost & Savings Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Total Material Cost
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    ${data.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Est. Annual Savings
                    </span>
                  </div>
                  <span className="font-semibold text-primary">
                    ${data.savings?.annual || "0"}/year
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Payback Period
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {data.savings?.payback || "N/A"} years
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-sm text-foreground">
                  Your optimized wall design will pay for itself in{" "}
                  <span className="font-semibold text-primary">{data.savings?.payback || "N/A"} years</span>{" "}
                  through reduced energy costs.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button className="w-full gap-2" variant="outline">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Link href={`/dashboard/procurement?projectId=${projectId}`}>
              <Button className="w-full gap-2">
                <Send className="h-4 w-4" />
                Send to Procurement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
