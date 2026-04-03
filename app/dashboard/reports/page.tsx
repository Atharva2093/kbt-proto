"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  Download,
  Share2,
  Building,
  Calendar,
  MapPin,
  Ruler,
  Thermometer,
  Zap,
  DollarSign,
} from "lucide-react"

const temperatureData = [
  { position: 0, temp: 22, label: "Inside" },
  { position: 25, temp: 21 },
  { position: 50, temp: 18 },
  { position: 75, temp: 14 },
  { position: 100, temp: 8 },
  { position: 125, temp: 2 },
  { position: 139, temp: -5, label: "Outside" },
]

const energySavingsData = [
  { month: "Jan", original: 850, optimized: 420 },
  { month: "Feb", original: 780, optimized: 390 },
  { month: "Mar", original: 620, optimized: 310 },
  { month: "Apr", original: 450, optimized: 230 },
  { month: "May", original: 280, optimized: 150 },
  { month: "Jun", original: 180, optimized: 100 },
]

const wallLayers = [
  { name: "Aerogel Panel", thickness: 25, color: "bg-cyan-400" },
  { name: "Mineral Wool", thickness: 100, color: "bg-cyan-500" },
  { name: "Vapor Barrier", thickness: 2, color: "bg-cyan-600" },
  { name: "Cement Board", thickness: 12, color: "bg-cyan-700" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Engineering Report
          </h1>
          <p className="text-muted-foreground">
            Comprehensive thermal analysis report for your project
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Project Name</p>
                <p className="font-medium text-foreground">
                  Office Building Alpha
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="font-medium text-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Climate Zone</p>
                <p className="font-medium text-foreground">Zone 4 - Mixed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Ruler className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Wall Area</p>
                <p className="font-medium text-foreground">450 m²</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Temperature Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Temperature Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="position"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    label={{
                      value: "Wall Thickness (mm)",
                      position: "insideBottom",
                      offset: -5,
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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

        {/* Energy Savings Comparison */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Monthly Energy Cost Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energySavingsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    label={{
                      value: "Cost ($)",
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
                  <Bar
                    dataKey="original"
                    fill="hsl(var(--muted-foreground))"
                    name="Original Design"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="optimized"
                    fill="hsl(var(--primary))"
                    name="Optimized Design"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Original Design
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">
                  Optimized Design
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wall Design Diagram */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Optimized Wall Design</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="flex w-full max-w-md gap-1">
              {wallLayers.map((layer, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  style={{ flex: layer.thickness }}
                >
                  <div
                    className={`h-32 w-full rounded ${layer.color}`}
                    title={layer.name}
                  />
                  <span className="mt-2 text-center text-xs text-muted-foreground">
                    {layer.name}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {layer.thickness}mm
                  </span>
                </div>
              ))}
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-sm text-muted-foreground">Total Thickness</p>
                <p className="text-2xl font-bold text-foreground">139 mm</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-sm text-muted-foreground">U-Value</p>
                <p className="text-2xl font-bold text-primary">0.24 W/m²K</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-sm text-muted-foreground">R-Value</p>
                <p className="text-2xl font-bold text-foreground">4.17 m²K/W</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-sm text-muted-foreground">Rating</p>
                <Badge className="mt-1 bg-primary/20 text-primary">A+ Grade</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Thermometer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Heat Loss Reduction</p>
                <p className="text-3xl font-bold text-foreground">62%</p>
                <p className="text-xs text-muted-foreground">
                  vs. original design
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Energy Savings</p>
                <p className="text-3xl font-bold text-foreground">$2,840</p>
                <p className="text-xs text-muted-foreground">
                  projected yearly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Material Cost</p>
                <p className="text-3xl font-bold text-foreground">$6,675</p>
                <p className="text-xs text-muted-foreground">
                  2.4 year payback
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
