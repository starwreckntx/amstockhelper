
import { SimpleLayout } from '@/components/layout/simple-layout'
import { SearchInterface } from '@/components/search/search-interface'

export default function SearchPage() {
  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search & Query</h1>
          <p className="text-muted-foreground">
            Advanced search across all production data with filtering and export capabilities
          </p>
        </div>
        <SearchInterface />
      </div>
    </SimpleLayout>
  )
}
