
import { SimpleLayout } from '@/components/layout/simple-layout'

export default function MaintenancePage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
          <p className="text-muted-foreground">
            Track equipment maintenance and service records
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Maintenance Logs</h3>
            <p className="text-muted-foreground">Record equipment service and repairs</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Preventive Maintenance</h3>
            <p className="text-muted-foreground">Schedule and track routine maintenance</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Equipment History</h3>
            <p className="text-muted-foreground">View comprehensive maintenance history</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
