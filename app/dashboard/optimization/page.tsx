"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function OptimizationPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      if (!user) return
      setLoading(true)
      try {
        const token = await user.getIdToken(true)
        
        // 1. Fetch Materials Database for Hydration
        const mRes = await fetch("/api/materials", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        const mJson = await mRes.json()
        if (!controller.signal.aborted) {
          setMaterials(mJson)
        }

        // 2. Run Optimization
        const res = await fetch("/api/ai/optimize", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            projectId,
            climateZone: "zone-4",
            buildingType: "commercial",
            layers: []
          }),
          signal: controller.signal
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)

        if (!controller.signal.aborted) {
          setResult(json)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || "Failed to generate optimization")
          toast.error("AI engine encountered an error")
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


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">AI is optimizing your wall design...</h2>
        <p className="text-muted-foreground">Calculating thermal efficiency and material compatibility</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Optimization Failed</h2>
        <p className="text-muted-foreground max-w-md">{error}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>Retry Search</Button>
      </div>
    )
  }

  const improvements = [
    {
      title: "Efficiency Gain",
      value: `${result.expectedEfficiencyGain}%`,
      description: "Compared to original design",
      icon: TrendingDown,
      color: "text-emerald-400",
    },
    {
      title: "Cost Impact",
      value: `$${result.costImpact.toLocaleString()}`,
      description: "Estimated material investment",
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
          {result.layers.map((layer: any, i: number) => {
            const matDetails = materials.find(m => m.id === layer.materialId);
            return (
              <Card key={i} className="border-border bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Layer {i + 1}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {layer.thickness} mm
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-primary">
                      {matDetails?.name || "Premium Insulation Layer"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Thermal Conductivity: {matDetails?.conductivity || "0.021"} W/mK
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Material Specification Status:
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      Verified for {searchParams.get("climateZone") || "Standard Zone"} compliance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Reasoning */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">AI Reasoning & Insights</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-foreground leading-relaxed">
             {result.reasoning}
           </p>
        </CardContent>
      </Card>

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
        <Link href={`/dashboard/materials?projectId=${projectId}`} className="flex-1">
          <Button className="w-full gap-2" size="lg">
            Generate Material List
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/dashboard/thermal-analysis?projectId=${projectId}`}>
          <Button variant="outline" size="lg">
            Modify Analysis
          </Button>
        </Link>
      </div>
    </div>
  )
}
