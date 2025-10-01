
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  Factory,
  ShieldCheck,
  Wrench,
  Thermometer,
  FileText,
  Eye
} from 'lucide-react'
import { SearchResults } from './search-results'
import { SearchFilters } from './search-filters'

interface SearchQuery {
  searchType: string
  searchTerm: string
  filters: {
    workOrderId?: string
    heatNumber?: string
    alloyType?: string
    operatorId?: string
    dateFrom?: string
    dateTo?: string
    qualityRating?: string
    defectType?: string
    equipmentId?: string
    inspectorId?: string
  }
}

interface SearchOptions {
  workOrders: Array<{ id: string; workOrderNumber: string }>
  heatNumbers: Array<{ heatNumber: string; alloyType: { alloyName: string } }>
  alloyTypes: Array<{ id: string; alloyName: string }>
  equipment: Array<{ id: string; equipmentModel: string }>
}

export function SearchInterface() {
  const [activeTab, setActiveTab] = useState('casting-runs')
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    searchType: 'casting-runs',
    searchTerm: '',
    filters: {}
  })
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchOptions, setSearchOptions] = useState<SearchOptions | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    fetchSearchOptions()
  }, [])

  useEffect(() => {
    setSearchQuery(prev => ({ ...prev, searchType: activeTab }))
  }, [activeTab])

  const fetchSearchOptions = async () => {
    try {
      const response = await fetch('/api/search/options')
      if (response.ok) {
        const data = await response.json()
        setSearchOptions(data)
      }
    } catch (error) {
      console.error('Error fetching search options:', error)
    }
  }

  const performSearch = async () => {
    if (!searchQuery.searchType) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchQuery),
      })

      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
        setHasSearched(true)
      } else {
        console.error('Search failed')
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error performing search:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery({
      searchType: activeTab,
      searchTerm: '',
      filters: {}
    })
    setSearchResults([])
    setHasSearched(false)
  }

  const exportResults = async () => {
    if (searchResults.length === 0) return

    try {
      const response = await fetch('/api/search/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchType: searchQuery.searchType,
          results: searchResults
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `foundry-${searchQuery.searchType}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting results:', error)
    }
  }

  const searchCategories = [
    {
      id: 'casting-runs',
      name: 'Casting Runs',
      description: 'Production data reports and casting records',
      icon: Factory,
      count: 'PDR Data'
    },
    {
      id: 'quality-inspections',
      name: 'Quality Inspections',
      description: 'QA assessments and quality ratings',
      icon: ShieldCheck,
      count: 'QA Records'
    },
    {
      id: 'maintenance-records',
      name: 'Maintenance Records',
      description: 'Equipment service and maintenance logs',
      icon: Wrench,
      count: 'Service Logs'
    },
    {
      id: 'defect-records',
      name: 'Defect Records',
      description: 'Quality issues and defect tracking',
      icon: ShieldCheck,
      count: 'Issues'
    },
    {
      id: 'heat-numbers',
      name: 'Heat Numbers',
      description: 'Material batch and traceability records',
      icon: Thermometer,
      count: 'Batches'
    },
    {
      id: 'work-orders',
      name: 'Work Orders',
      description: 'Job tracking and production scheduling',
      icon: FileText,
      count: 'Jobs'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Quick Search
          </CardTitle>
          <CardDescription>
            Search across all foundry data or use advanced filters below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search work orders, heat numbers, operators, or any production data..."
                value={searchQuery.searchTerm}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, searchTerm: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
            </div>
            <Button onClick={performSearch} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            <Button variant="outline" onClick={clearSearch}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-6">
            {searchCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                <category.icon className="h-3 w-3 mr-1" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {hasSearched && searchResults.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {searchResults.length} results
              </Badge>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          )}
        </div>

        {searchCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Filters Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SearchFilters
                      searchType={category.id}
                      filters={searchQuery.filters}
                      onFiltersChange={(filters) => 
                        setSearchQuery(prev => ({ ...prev, filters }))
                      }
                      searchOptions={searchOptions}
                    />
                    <Separator className="my-4" />
                    <Button 
                      onClick={performSearch} 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <category.icon className="h-5 w-5 mr-2" />
                        {category.name}
                      </div>
                      {hasSearched && (
                        <Badge variant="outline">
                          {searchResults.length} results
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SearchResults
                      searchType={category.id}
                      results={searchResults}
                      isLoading={isLoading}
                      hasSearched={hasSearched}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
