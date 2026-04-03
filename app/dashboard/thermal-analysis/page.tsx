"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Plus, Trash2, Play, Thermometer, Gauge, Award } from "lucide-react"

const temperatureData = [
  { position: 0, temp: 22 },
  { position: 50, temp: 20 },
  { position: 100, temp: 16 },
  { position: 150, temp: 10 },
  { position: 200, temp: 5 },
  { position: 250, temp: 0 },
  { position: 300, temp: -5 },
]

interface WallLayer {
  id: number
  material: string
  conductivity: string
  density: string
  thickness: string
}

export default function ThermalAnalysisPage() {
  const [layers, setLayers] = useState<WallLayer[]>([
    { id: 1, material: "Brick", conductivity: "0.72", density: "1920", thickness: "100" },
    { id: 2, material: "Insulation", conductivity: "0.04", density: "30", thickness: "80" },
    { id: 3, material: "Concrete", conductivity: "1.28", density: "2300", thickness: "150" },
  ])
  const [analysisRun, setAnalysisRun] = useState(false)

  const addLayer = () => {
    const newId = layers.length > 0 ? Math.max(...layers.map((l) => l.id)) + 1 : 1
    setLayers([
      ...layers,
      { id: newId, material: "", conductivity: "", density: "", thickness: "" },
    ])
  }

  const removeLayer = (id: number) => {
    setLayers(layers.filter((l) => l.id !== id))
  }

  const runAnalysis = () => {
    setAnalysisRun(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Thermal Analysis</h1>
        <p className="text-muted-foreground">
          Configure wall layers and run thermal simulations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" defaultValue="Office Building Alpha" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="climate-zone">Climate Zone</Label>
                <Select defaultValue="zone-4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zone-1">Zone 1 - Very Hot</SelectItem>
                    <SelectItem value="zone-2">Zone 2 - Hot</SelectItem>
                    <SelectItem value="zone-3">Zone 3 - Warm</SelectItem>
                    <SelectItem value="zone-4">Zone 4 - Mixed</SelectItem>
                    <SelectItem value="zone-5">Zone 5 - Cool</SelectItem>
                    <SelectItem value="zone-6">Zone 6 - Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wall-area">Wall Area (m²)</Label>
                <Input id="wall-area" type="number" defaultValue="450" />
              </div>
            </CardContent>
          </Card>

          {/* Wall Layers */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Wall Layers</CardTitle>
              <Button variant="outline" size="sm" onClick={addLayer} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Layer
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Layer {index + 1}
                    </span>
                    {layers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeLayer(layer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Material Name</Label>
                      <Input
                        defaultValue={layer.material}
                        placeholder="e.g., Brick"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Conductivity (k)</Label>
                      <Input
                        defaultValue={layer.conductivity}
                        placeholder="W/mK"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Density (kg/m³)</Label>
                      <Input
                        defaultValue={layer.density}
                        placeholder="kg/m³"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Thickness (mm)</Label>
                      <Input
                        defaultValue={layer.thickness}
                        placeholder="mm"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Boundary Conditions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Boundary Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inside-temp">Inside Temperature (°C)</Label>
                  <Input id="inside-temp" type="number" defaultValue="22" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outside-temp">Outside Temperature (°C)</Label>
                  <Input id="outside-temp" type="number" defaultValue="-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={runAnalysis} className="w-full gap-2" size="lg">
            <Play className="h-4 w-4" />
            Run Thermal Analysis
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">
                Temperature Distribution Across Wall Thickness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="position"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Position (mm)",
                        position: "insideBottom",
                        offset: -5,
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Temp (°C)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Result Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Thermometer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Heat Loss</p>
                    <p className="text-xl font-bold text-foreground">
                      {analysisRun ? "18.4" : "--"} W/m²
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Gauge className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">U-Value</p>
                    <p className="text-xl font-bold text-foreground">
                      {analysisRun ? "0.68" : "--"} W/m²K
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                    <p className="text-xl font-bold text-foreground">
                      {analysisRun ? "72" : "--"}/100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {analysisRun && (
            <Link href="/dashboard/optimization">
              <Button className="w-full" variant="outline">
                Proceed to Optimization Engine
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
