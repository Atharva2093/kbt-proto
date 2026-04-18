"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
  FolderOpen,
  Thermometer,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function DashboardPage() {
  const { user } = useAuth()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [data, setData] = useState({ 
    metrics: [], 
    recentProjects: [] 
  })

  const [formData, setFormData] = useState({
    name: "",
    buildingType: "residential",
    climateZone: "zone-4",
    wallArea: "0"
  })

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      if (!user) return
      try {
        const token = await user.getIdToken()
        const res = await fetch("/api/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        
        if (!controller.signal.aborted) {
          setData(json)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error("Failed to load dashboard data")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDashboard()
    return () => controller.abort();
  }, [user])

  const handleCreateProject = async () => {
    if (!formData.name) return toast.error("Project name is required")
    setCreating(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      
      toast.success("Project created successfully")
      setCreateDialogOpen(false)
      // Refresh data
      const summaryRes = await fetch("/api/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(await summaryRes.json())
    } catch (err: any) {
      toast.error(err.message || "Failed to create project")
    } finally {
      setCreating(false)
    }
  }

  const iconMap: any = {
    "Active Projects": FolderOpen,
    "Last Heat Loss": Thermometer,
    "Avg Efficiency": TrendingDown,
    "System Status": DollarSign,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your thermal analysis projects
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new thermal analysis project by providing the basic details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  placeholder="Enter project name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building-type">Building Type</Label>
                <Select 
                  value={formData.buildingType}
                  onValueChange={(v) => setFormData({...formData, buildingType: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="climate-zone">Climate Zone</Label>
                <Select
                  value={formData.climateZone}
                  onValueChange={(v) => setFormData({...formData, climateZone: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select climate zone" />
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
                <Input
                  id="wall-area"
                  type="number"
                  placeholder="Enter wall area"
                  value={formData.wallArea}
                  onChange={(e) => setFormData({...formData, wallArea: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={creating}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.metrics.map((metric: any, i) => {
              const Icon = iconMap[metric.title] || FolderOpen
              return (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.title}</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {metric.change}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recent Projects Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">
                        Project Name
                      </th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">
                        Building Type
                      </th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">
                        Last Updated
                      </th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentProjects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No projects found. Create your first project to get started.
                        </td>
                      </tr>
                    ) : (
                      data.recentProjects.map((project: any, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium text-foreground">
                            {project.name}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground capitalize">
                            {project.type}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {new Date(project.updated).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <Badge
                              variant={
                                project.status === "Analyzed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                project.status === "Analyzed"
                                  ? "bg-primary/20 text-primary"
                                  : ""
                              }
                            >
                              {project.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Link href={`/dashboard/thermal-analysis?projectId=${project.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                Open <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
