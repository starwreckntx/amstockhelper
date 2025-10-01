
import { SimpleLayout } from '@/components/layout/simple-layout'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export default function DashboardPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Foundry Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of production, quality, and equipment performance
          </p>
        </div>
        <DashboardOverview />
      </div>
    </SimpleLayout>
  )
}
