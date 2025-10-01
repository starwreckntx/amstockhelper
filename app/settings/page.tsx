
import { SimpleLayout } from '@/components/layout/simple-layout'

export default function SettingsPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and operational parameters
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Foundry Configuration</h3>
            <p className="text-muted-foreground">Set default parameters for casting operations</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Data Export Settings</h3>
            <p className="text-muted-foreground">Configure data export formats and schedules</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">System Preferences</h3>
            <p className="text-muted-foreground">Customize system behavior and appearance</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
