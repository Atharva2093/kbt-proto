"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
import { Plus, Trash2, Play, Thermometer, Gauge, Award, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface WallLayer {
  id: string
  material: string
  conductivity: string
  density: string
  thickness: string
}

export default function ThermalAnalysisPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [layers, setLayers] = useState<WallLayer[]>([
    { id: "1", material: "Brick", conductivity: "0.72", density: "1920", thickness: "100" },
    { id: "2", material: "Mineral Wool", conductivity: "0.04", density: "30", thickness: "80" },
  ])
  const [boundary, setBoundary] = useState({ inside: 22, outside: -5, area: 450 })
  const [materials, setMaterials] = useState<any[]>([])
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      if (!user) return
      try {
        const token = await user.getIdToken()
        
        // Fetch Materials
        const mRes = await fetch("/api/materials", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        const materialsData = await mRes.json()

        if (!controller.signal.aborted) {
          setMaterials(materialsData)
        }

        // Fetch Project if ID exists
        if (projectId && !controller.signal.aborted) {
          const pRes = await fetch(`/api/projects`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
          })
          const projects = await pRes.json()
          const p = projects.find((x: any) => x.id === projectId)
          
          if (p && !controller.signal.aborted) {
             // Logic to load layers if we had a GET endpoint for specific project
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error("Failed to initialize analysis")
        }
      } finally {
        if (!controller.signal.aborted) {
          setInitialLoading(false)
        }
      }
    }

    init()
    return () => controller.abort();
  }, [user, projectId])

  const addLayer = () => {
    setLayers([
      ...layers,
      { id: Date.now().toString(), material: "", conductivity: "", density: "", thickness: "" },
    ])
  }

  const removeLayer = (id: string) => {
    setLayers(layers.filter((l) => l.id !== id))
  }

  const runAnalysis = async () => {
    if (!projectId) return toast.error("Please select or create a project first")
    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/analysis/calculate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          projectId,
          layers,
          area: boundary.area,
          insideTemp: boundary.inside,
          outsideTemp: boundary.outside
        })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setResults(json)
      toast.success("Analysis complete")
    } catch (err: any) {
      toast.error(err.message || "Calculation failed")
    } finally {
      setLoading(false)
    }
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
          {/* Project Info - Replaced static project name with actual context if available */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label>Current Project ID</Label>
                <div className="text-sm font-mono text-muted-foreground bg-secondary/30 p-2 rounded mt-1">
                    {projectId || "No Project Selected"}
                </div>
               </div>
              <div className="space-y-2">
                <Label htmlFor="wall-area">Wall Area (m²)</Label>
                <Input 
                  id="wall-area" 
                  type="number" 
                  value={boundary.area}
                  onChange={(e) => setBoundary({...boundary, area: parseFloat(e.target.value)})}
                />
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
                      <Label className="text-xs">Material</Label>
                      <Select 
                        value={layer.material} 
                        onValueChange={(val) => {
                          const mat = materials.find(m => m.name === val);
                          const newLayers = [...layers];
                          newLayers[index] = { 
                            ...layer, 
                            material: val, 
                            conductivity: mat?.conductivity?.toString() || layer.conductivity,
                            density: mat?.density?.toString() || layer.density
                          };
                          setLayers(newLayers);
                        }}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map(m => (
                            <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Conductivity (k) (W/mK)</Label>
                      <Input
                        value={layer.conductivity}
                        onChange={(e) => {
                          const newLayers = [...layers];
                          newLayers[index].conductivity = e.target.value;
                          setLayers(newLayers);
                        }}
                        placeholder="W/mK"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Density (kg/m³)</Label>
                      <Input
                        value={layer.density}
                        onChange={(e) => {
                          const newLayers = [...layers];
                          newLayers[index].density = e.target.value;
                          setLayers(newLayers);
                        }}
                        placeholder="kg/m³"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Thickness (mm)</Label>
                      <Input
                        value={layer.thickness}
                        onChange={(e) => {
                          const newLayers = [...layers];
                          newLayers[index].thickness = e.target.value;
                          setLayers(newLayers);
                        }}
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
                  <Input 
                    id="inside-temp" 
                    type="number" 
                    value={boundary.inside}
                    onChange={(e) => setBoundary({...boundary, inside: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outside-temp">Outside Temperature (°C)</Label>
                  <Input 
                    id="outside-temp" 
                    type="number" 
                    value={boundary.outside} 
                    onChange={(e) => setBoundary({...boundary, outside: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={runAnalysis} className="w-full gap-2" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
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
                {results ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.tempProfile}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="position"
                        stroke="#CBD5F5"
                        tick={{ fill: "#CBD5F5", fontSize: 12 }}
                        tickLine={{ stroke: "#CBD5F5" }}
                        label={{
                          value: "Position (mm)",
                          position: "insideBottom",
                          offset: -5,
                          fill: "#CBD5F5",
                          fontSize: 12,
                        }}
                      />
                      <YAxis
                        stroke="#CBD5F5"
                        tick={{ fill: "#CBD5F5", fontSize: 12 }}
                        tickLine={{ stroke: "#CBD5F5" }}
                        label={{
                          value: "Temp (°C)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#CBD5F5",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#22C55E"
                        strokeWidth={3}
                        dot={{ fill: "#22C55E", strokeWidth: 0 }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    Run analysis to see temperature distribution
                  </div>
                )}
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
                      {results ? results.heatLoss : "--"} W
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
                      {results ? results.uValue : "--"} W/m²K
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
                      {results ? results.efficiency : "--"}/100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {results && (
            <Link href={`/dashboard/optimization?projectId=${projectId}`}>
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
