
import { SimpleLayout } from '@/components/layout/simple-layout'

export default function ReportsPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate production reports and performance analytics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Production Reports</h3>
            <p className="text-muted-foreground">Daily, weekly, and monthly production summaries</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Quality Reports</h3>
            <p className="text-muted-foreground">Quality metrics and trend analysis</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">Equipment efficiency and operational insights</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
