export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">T</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ThermalWall AI</h1>
          <p className="text-sm text-muted-foreground text-center">
            Advanced Thermal Engineering & AI Optimization
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
