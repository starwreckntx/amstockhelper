
import { SimpleLayout } from '@/components/layout/simple-layout'

export default function TraceabilityPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Traceability</h1>
          <p className="text-muted-foreground">
            Trace production data from raw materials to finished castings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Heat Number Tracking</h3>
            <p className="text-muted-foreground">Follow heat numbers through production process</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Defect Analysis</h3>
            <p className="text-muted-foreground">Trace defects back to production parameters</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Material Lineage</h3>
            <p className="text-muted-foreground">Track material flow and transformations</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
