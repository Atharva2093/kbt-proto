"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Globe, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Profile Settings</CardTitle>
              </div>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Acme Engineering" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive project updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Analysis Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when thermal analysis finishes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Procurement Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Order status and shipping notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly project summary
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Regional Settings</CardTitle>
              </div>
              <CardDescription>
                Configure units and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Temperature Unit</Label>
                  <Select defaultValue="celsius">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Measurement System</Label>
                  <Select defaultValue="metric">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (m, mm, kg)</SelectItem>
                      <SelectItem value="imperial">Imperial (ft, in, lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="inr">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Enable Two-Factor Auth
              </Button>
              <Separator />
              <div>
                <p className="text-sm font-medium text-foreground">Active Sessions</p>
                <p className="text-sm text-muted-foreground">
                  1 active session on this device
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="font-semibold text-foreground">Pro Plan</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited projects & analysis
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">$49/mo</p>
              </div>
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
