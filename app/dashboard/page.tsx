"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
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
} from "lucide-react"

const metrics = [
  {
    title: "Active Projects",
    value: "12",
    icon: FolderOpen,
    change: "+2 this month",
  },
  {
    title: "Last Heat Loss",
    value: "18.4 W/m²",
    icon: Thermometer,
    change: "-12% from target",
  },
  {
    title: "Avg Energy Savings",
    value: "34%",
    icon: TrendingDown,
    change: "+5% improvement",
  },
  {
    title: "Est. Material Cost",
    value: "$24,500",
    icon: DollarSign,
    change: "For current project",
  },
]

const recentProjects = [
  {
    name: "Office Building Alpha",
    type: "Commercial",
    updated: "2 hours ago",
    status: "In Progress",
  },
  {
    name: "Residential Complex B",
    type: "Residential",
    updated: "1 day ago",
    status: "Completed",
  },
  {
    name: "Warehouse Facility",
    type: "Industrial",
    updated: "3 days ago",
    status: "Pending Review",
  },
  {
    name: "School Campus",
    type: "Educational",
    updated: "1 week ago",
    status: "In Progress",
  },
]

export default function DashboardPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

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
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="Enter project name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building-type">Building Type</Label>
                <Select>
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
                <Select>
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
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setCreateDialogOpen(false)}>
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
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
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
                {recentProjects.map((project, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm font-medium text-foreground">
                      {project.name}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {project.type}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {project.updated}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          project.status === "Completed"
                            ? "default"
                            : project.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          project.status === "Completed"
                            ? "bg-primary/20 text-primary"
                            : ""
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Link href="/dashboard/thermal-analysis">
                        <Button variant="ghost" size="sm" className="gap-1">
                          Open <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
