"use client"

import Link from "next/link"
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
import { Download, Send, TrendingDown, DollarSign, Clock } from "lucide-react"

const materials = [
  {
    layer: 1,
    name: "Aerogel Insulation Panel",
    quantity: "45 m²",
    unitCost: "$85.00",
    totalCost: "$3,825.00",
  },
  {
    layer: 2,
    name: "High-Density Mineral Wool",
    quantity: "45 m²",
    unitCost: "$32.00",
    totalCost: "$1,440.00",
  },
  {
    layer: 3,
    name: "Vapor Barrier Membrane",
    quantity: "50 m²",
    unitCost: "$4.50",
    totalCost: "$225.00",
  },
  {
    layer: 4,
    name: "Fiber Cement Board",
    quantity: "45 m²",
    unitCost: "$18.00",
    totalCost: "$810.00",
  },
  {
    layer: 5,
    name: "Fasteners & Adhesives Kit",
    quantity: "2 sets",
    unitCost: "$120.00",
    totalCost: "$240.00",
  },
  {
    layer: 6,
    name: "Sealant & Tape Bundle",
    quantity: "3 sets",
    unitCost: "$45.00",
    totalCost: "$135.00",
  },
]

const totalMaterialCost = materials.reduce((sum, m) => {
  return sum + parseFloat(m.totalCost.replace("$", "").replace(",", ""))
}, 0)

export default function MaterialsPage() {
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
                    {materials.map((material) => (
                      <TableRow key={material.layer} className="border-border">
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
                        ${totalMaterialCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                    ${totalMaterialCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Est. Annual Savings
                    </span>
                  </div>
                  <span className="font-semibold text-primary">$2,840/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Payback Period
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">2.4 years</span>
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-sm text-foreground">
                  Your optimized wall design will pay for itself in{" "}
                  <span className="font-semibold text-primary">2.4 years</span>{" "}
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
            <Link href="/dashboard/procurement">
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
