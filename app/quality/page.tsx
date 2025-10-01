
import { SimpleLayout } from '@/components/layout/simple-layout'

export default function QualityPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground">
            Manage quality inspections and compliance tracking
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Quality Inspections</h3>
            <p className="text-muted-foreground">Record and track quality assessment results</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Defect Tracking</h3>
            <p className="text-muted-foreground">Monitor and analyze casting defects</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Compliance Reports</h3>
            <p className="text-muted-foreground">Generate quality compliance documentation</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
