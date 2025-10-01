
import { SimpleLayout } from '@/components/layout/simple-layout'

export default function ProductionPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage casting production operations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Active Casting Runs</h3>
            <p className="text-muted-foreground">View and monitor current production runs</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Production Schedule</h3>
            <p className="text-muted-foreground">Plan and schedule upcoming casting operations</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Equipment Status</h3>
            <p className="text-muted-foreground">Monitor spinner and foundry equipment</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
