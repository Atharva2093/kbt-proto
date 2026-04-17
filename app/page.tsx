"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Layers,
  Clock,
  DollarSign,
  Thermometer,
  Zap,
  Settings,
  ArrowRight,
  BarChart3,
  CheckCircle,
} from "lucide-react"

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("SYNC_FAILED");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">ThermalWall AI</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How it Works
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="hidden sm:inline-flex"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login
            </Button>
            <Link href="/dashboard">
              <Button>Try Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 lg:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Smart Optimization Engine for Energy Efficient Composite Wall Design
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                AI-powered platform that analyzes heat transfer in composite walls, recommends optimal materials, and generates a ready-to-purchase procurement list.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Try Demo <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  View Prototype
                </Button>
              </div>
            </div>
            <div className="relative">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="features" className="border-y border-border bg-card px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Challenges We Solve
              </h2>
              <p className="mt-4 text-muted-foreground">
                Traditional wall design faces critical inefficiencies
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-secondary/50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Complexity</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Heat transfer behavior is complex and requires deep physics and material knowledge to optimize effectively.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-secondary/50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Time Consuming</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Manual calculations and trial-and-error material selection waste valuable engineering hours.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-secondary/50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Cost Impact</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Poor insulation leads to high energy bills. Inefficient wall design wastes valuable resources.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                Four simple steps to optimized wall design
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { step: 1, title: "Enter Wall Data", desc: "Input wall layers & temperatures" },
                { step: 2, title: "AI Analysis", desc: "Advanced thermal analysis runs" },
                { step: 3, title: "Optimized Design", desc: "Get optimized wall design" },
                { step: 4, title: "Procurement", desc: "Auto material list ready" },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <span className="text-lg font-bold">{item.step}</span>
                    </div>
                    {i < 3 && (
                      <div className="absolute left-[calc(50%+28px)] top-7 hidden h-0.5 w-[calc(100%-56px)] bg-border md:block" />
                    )}
                    <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-y border-border bg-card px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Key Benefits
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-background">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Thermometer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Reduce Heat Loss</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-optimized wall compositions minimize thermal bridging and heat transfer.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-background">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Save Electricity Cost</h3>
                    <p className="text-sm text-muted-foreground">
                      Better insulation means lower HVAC requirements and reduced energy bills.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-background">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Automate Decisions</h3>
                    <p className="text-sm text-muted-foreground">
                      Let AI handle complex engineering calculations and material selection.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden px-6 py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Start designing energy-efficient buildings today
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join engineers and architects already using ThermalWall AI
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">ThermalWall AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ThermalWall AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <Card className="border-border bg-card/80 backdrop-blur">
        <CardContent className="p-6">
          {/* Wall Layers Visualization */}
          <div className="mb-6 flex gap-1">
            {[
              { color: "bg-cyan-600", label: "Exterior" },
              { color: "bg-cyan-500", label: "Insulation" },
              { color: "bg-cyan-400", label: "Barrier" },
              { color: "bg-cyan-300", label: "Interior" },
            ].map((layer, i) => (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className={`h-24 w-full rounded ${layer.color}`} />
                <span className="mt-2 text-xs text-muted-foreground">{layer.label}</span>
              </div>
            ))}
          </div>
          {/* Analytics Preview */}
          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Thermal Analysis</span>
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">U-Value</span>
                <span className="font-medium text-primary">0.24 W/m²K</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Heat Loss</span>
                <span className="font-medium text-primary">12.3 W/m²</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="flex items-center gap-1 font-medium text-primary">
                  <CheckCircle className="h-3 w-3" /> 94%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
