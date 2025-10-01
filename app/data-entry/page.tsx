
import { SimpleLayout } from '@/components/layout/simple-layout'
import { DataEntryHub } from '@/components/data-entry/data-entry-hub'

export default function DataEntryPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Entry</h1>
          <p className="text-muted-foreground">
            Digital forms for production data reports and maintenance logs
          </p>
        </div>
        <DataEntryHub />
      </div>
    </SimpleLayout>
  )
}
