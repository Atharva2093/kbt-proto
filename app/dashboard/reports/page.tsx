"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
  Loader2,
  FileText,
  Plus,
  ArrowRight,
  Printer,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import Link from "next/link"

export default function ReportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get("id")
  const projectId = searchParams.get("projectId")

  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      if (!user) return
      setLoading(true)
      try {
        const token = await user.getIdToken()
        
        if (reportId) {
            const res = await fetch(`/api/reports?id=${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal
            })
            const json = await res.json()
            if (!controller.signal.aborted) {
                setData(json)
            }
        } else {
            const url = projectId 
                ? `/api/reports?projectId=${projectId}`
                : `/api/reports`
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal
            })
            const json = await res.json()
            if (!controller.signal.aborted) {
                setReports(json)
            }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error("Failed to load report data")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => controller.abort();
  }, [user, reportId, projectId])

  const handleGenerate = async (pId: string) => {
    if (!user) return
    setActing(true)
    try {
        const token = await user.getIdToken()
        const res = await fetch("/api/reports/generate", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ projectId: pId })
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        toast.success("Engineering report generated successfully")
        router.push(`/dashboard/reports?id=${json.id}`)
    } catch (err: any) {
        toast.error(err.message || "Failed to generate report")
    } finally {
        setActing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // --- RENDERING LIST MODE ---
  if (!reportId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Engineering Reports</h1>
            <p className="text-muted-foreground">Historical snapshots of thermal analyses and procurement specs</p>
          </div>
          {projectId && (
            <Button onClick={() => handleGenerate(projectId)} disabled={acting}>
              {acting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Generate New Report
            </Button>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No Reports Found</h2>
            <p className="text-muted-foreground">Generate a report from the Project or Procurement pages.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:border-primary/50 transition-colors group">
                <CardContent className="p-0">
                  <Link href={`/dashboard/reports?id=${report.id}`} className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{report.type}</p>
                            <p className="text-sm text-muted-foreground">Project: {report.project.name} • {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline">{report.status}</Badge>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // --- RENDERING VIEW MODE (Snapshot) ---
  if (!data || !data.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Report Not Found</h2>
        <p className="text-muted-foreground">The specific report snapshot could not be loaded.</p>
        <Button className="mt-6" onClick={() => router.push("/dashboard/reports")}>Back to Reports List</Button>
      </div>
    )
  }

  const snapshot = data.data
  const analysis = snapshot.analysis
  const project = snapshot.project
  const procurement = snapshot.procurement

  const temperatureData = analysis.details?.tempProfile || []
  const efficiency = analysis.efficiency || 0
  
  const energySavingsData = [
    { month: "Jan", original: 850, optimized: 850 * (1 - (efficiency/100)) },
    { month: "Feb", original: 780, optimized: 780 * (1 - (efficiency/100)) },
    { month: "Mar", original: 620, optimized: 620 * (1 - (efficiency/100)) },
    { month: "Apr", original: 450, optimized: 450 * (1 - (efficiency/100)) },
    { month: "May", original: 280, optimized: 280 * (1 - (efficiency/100)) },
    { month: "Jun", original: 180, optimized: 180 * (1 - (efficiency/100)) },
  ]

  return (
    <div className="space-y-6 print:space-y-8 print:p-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {data.type}
          </h1>
          <p className="text-muted-foreground">
            Historical snapshot of thermal data for {project.name}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
          <Button className="gap-2" onClick={() => toast.info("Download coming soon")}>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Project Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Project Name</p>
                <p className="font-medium text-foreground">{project.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Generated Date</p>
                <p className="font-medium text-foreground">
                  {new Date(data.createdAt).toLocaleDateString("en-US", {
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
                <p className="text-xs text-muted-foreground">Zone</p>
                <p className="font-medium text-foreground">{project.climateZone || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Ruler className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Design U-Value</p>
                <p className="font-medium text-foreground">{analysis.uValue?.toFixed(3)} W/m²K</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 print:grid-cols-1 print:gap-12">
        {/* Temperature Distribution */}
        <Card className="border-border bg-card break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-lg">Thermal Gradient Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="position"
                    stroke="#CBD5F5"
                    tick={{ fill: "#CBD5F5", fontSize: 12 }}
                    tickFormatter={(val) => `${val}mm`}
                  />
                  <YAxis
                    stroke="#CBD5F5"
                    tick={{ fill: "#CBD5F5", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff"
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
            </div>
          </CardContent>
        </Card>

        {/* Energy Savings Comparison */}
        <Card className="border-border bg-card break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-lg">Projected Savings Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energySavingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#CBD5F5" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#CBD5F5" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="original" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="optimized" fill="#22C55E" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 print:grid-cols-3 print:gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Thermometer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Efficiency</p>
                <p className="text-3xl font-bold text-foreground">{efficiency}%</p>
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
                <p className="text-sm text-muted-foreground">Annual Energy Gap</p>
                <p className="text-3xl font-bold text-foreground">$2,840</p>
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
                <p className="text-sm text-muted-foreground">Material Investment</p>
                <p className="text-3xl font-bold text-foreground">${procurement?.totalCost?.toLocaleString() || "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Material Specification (Print Only / Details) */}
      {procurement && (
        <Card className="border-border bg-card break-before-page">
            <CardHeader>
                <CardTitle className="text-lg">Material Specifications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground font-medium">
                                <th className="pb-3 pr-4">Material</th>
                                <th className="pb-3 px-4">Quantity</th>
                                <th className="pb-3 pl-4 text-right">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {procurement.items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="py-4 pr-4 font-medium text-foreground">{item.name}</td>
                                    <td className="py-4 px-4 text-muted-foreground">{item.quantity}</td>
                                    <td className="py-4 pl-4 text-right font-medium text-foreground">{item.totalCost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
