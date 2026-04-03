"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  TrendingDown,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const optimizedLayers = [
  {
    layer: 1,
    material: "Aerogel Insulation Panel",
    thickness: "25mm",
    conductivity: "0.015 W/mK",
    reason:
      "Ultra-low thermal conductivity provides excellent insulation in minimal thickness",
  },
  {
    layer: 2,
    material: "High-Density Mineral Wool",
    thickness: "100mm",
    conductivity: "0.035 W/mK",
    reason:
      "Cost-effective bulk insulation with excellent fire resistance properties",
  },
  {
    layer: 3,
    material: "Vapor Barrier Membrane",
    thickness: "2mm",
    conductivity: "0.25 W/mK",
    reason:
      "Prevents moisture migration and condensation within wall assembly",
  },
  {
    layer: 4,
    material: "Fiber Cement Board",
    thickness: "12mm",
    conductivity: "0.25 W/mK",
    reason:
      "Durable exterior finish with good thermal mass for temperature stability",
  },
]

const improvements = [
  {
    title: "Heat Loss Reduction",
    value: "62%",
    description: "Compared to original design",
    icon: TrendingDown,
    color: "text-emerald-400",
  },
  {
    title: "Energy Savings",
    value: "48%",
    description: "Annual HVAC cost reduction",
    icon: Zap,
    color: "text-amber-400",
  },
  {
    title: "Insulation Rating",
    value: "A+",
    description: "Exceeds building code requirements",
    icon: Shield,
    color: "text-primary",
  },
]

export default function OptimizationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Optimization Engine
            </h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            AI-generated optimized wall design for maximum thermal efficiency
          </p>
        </div>
        <Badge className="w-fit bg-primary/20 text-primary">
          <CheckCircle className="mr-1 h-3 w-3" />
          Optimization Complete
        </Badge>
      </div>

      {/* Success Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Optimized Composite Wall Design Generated
            </h2>
            <p className="text-sm text-muted-foreground">
              Based on your inputs, our AI has determined the optimal material
              configuration for your wall assembly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Optimized Layers */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Recommended Wall Layers
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {optimizedLayers.map((layer) => (
            <Card key={layer.layer} className="border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Layer {layer.layer}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {layer.thickness}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-primary">{layer.material}</p>
                  <p className="text-sm text-muted-foreground">
                    Thermal Conductivity: {layer.conductivity}
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Why AI selected this:
                  </p>
                  <p className="mt-1 text-sm text-foreground">{layer.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Improvements */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Performance Improvements
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {improvements.map((item, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {item.value}
                    </p>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/materials" className="flex-1">
          <Button className="w-full gap-2" size="lg">
            Generate Material List
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/dashboard/thermal-analysis">
          <Button variant="outline" size="lg">
            Modify Analysis
          </Button>
        </Link>
      </div>
    </div>
  )
}
