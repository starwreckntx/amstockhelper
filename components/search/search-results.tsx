
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Factory, 
  Calendar, 
  User, 
  Thermometer, 
  Gauge,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Wrench,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface SearchResultsProps {
  searchType: string
  results: any[]
  isLoading: boolean
  hasSearched: boolean
}

export function SearchResults({ searchType, results, isLoading, hasSearched }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <div className="mb-4">
            {searchType === 'casting-runs' && <Factory className="h-12 w-12 mx-auto opacity-50" />}
            {searchType === 'quality-inspections' && <ShieldCheck className="h-12 w-12 mx-auto opacity-50" />}
            {searchType === 'maintenance-records' && <Wrench className="h-12 w-12 mx-auto opacity-50" />}
            {searchType === 'defect-records' && <AlertTriangle className="h-12 w-12 mx-auto opacity-50" />}
            {searchType === 'heat-numbers' && <Thermometer className="h-12 w-12 mx-auto opacity-50" />}
            {searchType === 'work-orders' && <FileText className="h-12 w-12 mx-auto opacity-50" />}
          </div>
          <p className="text-lg font-medium">Search foundry data</p>
          <p className="text-sm">Enter search terms or apply filters to find records</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto opacity-50 mb-4" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">Try adjusting your search terms or filters</p>
        </div>
      </div>
    )
  }

  const renderCastingRunResult = (result: any) => (
    <Card key={result.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Factory className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold">
                {result.workOrder?.workOrderNumber || 'Unknown WO'}
              </h4>
              <Badge variant="secondary">
                Heat {result.heatNumber?.heatNumber || 'N/A'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(result.castingDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span>{result.operatorId || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gauge className="h-3 w-3 text-muted-foreground" />
                <span>{result.actualRpm || result.rpmSetting || 'N/A'} RPM</span>
              </div>
              <div className="flex items-center space-x-1">
                <Thermometer className="h-3 w-3 text-muted-foreground" />
                <span>{result.pourTemperature || 'N/A'}°C</span>
              </div>
            </div>

            {result.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.notes}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Badge variant={result.status === 'Completed' ? 'default' : 'secondary'}>
              {result.status || 'Unknown'}
            </Badge>
            <Link href={`/production/casting-run/${result.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderQualityInspectionResult = (result: any) => (
    <Card key={result.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold">
                Inspection #{result.id}
              </h4>
              <Badge variant={result.passFailStatus === 'Pass' ? 'default' : 
                             result.passFailStatus === 'Fail' ? 'destructive' : 'secondary'}>
                {result.passFailStatus || 'Unknown'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(result.inspectionDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span>{result.inspectorId || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant={
                  result.overallRating === 1 ? 'default' :
                  result.overallRating === 2 ? 'secondary' : 'destructive'
                }>
                  Rating: {result.overallRating || 'N/A'}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  {result.inspectionType || 'Standard'}
                </span>
              </div>
            </div>

            {result.castingRun?.workOrder?.workOrderNumber && (
              <p className="text-sm text-muted-foreground">
                Work Order: {result.castingRun.workOrder.workOrderNumber}
              </p>
            )}
          </div>
          
          <Link href={`/quality/inspection/${result.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const renderMaintenanceResult = (result: any) => (
    <Card key={result.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-orange-600" />
              <h4 className="font-semibold">
                {result.spinnerEquipment?.equipmentModel || result.spinnerId}
              </h4>
              <Badge variant="outline">
                {result.maintenanceType || 'Maintenance'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(result.maintenanceDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span>{result.technicianId || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs">Cost: ${result.cost || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant={
                  result.conditionAfterService === 'Excellent' ? 'default' :
                  result.conditionAfterService === 'Good' ? 'secondary' : 'destructive'
                }>
                  {result.conditionAfterService || 'Unknown'}
                </Badge>
              </div>
            </div>

            {result.maintenancePerformed && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.maintenancePerformed}
              </p>
            )}
          </div>
          
          <Link href={`/maintenance/record/${result.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const renderDefectResult = (result: any) => (
    <Card key={result.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold">
                {result.defectType || 'Unknown Defect'}
              </h4>
              <Badge variant={
                result.defectSeverity === 'Minor' ? 'secondary' :
                result.defectSeverity === 'Major' ? 'destructive' : 'destructive'
              }>
                {result.defectSeverity || 'Unknown'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Location:</span>
                <p>{result.defectLocation || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Cost Impact:</span>
                <p>${result.costImpact || 0}</p>
              </div>
              <div>
                <Badge variant={result.status === 'Resolved' ? 'default' : 'secondary'}>
                  {result.status || 'Open'}
                </Badge>
              </div>
            </div>

            {result.defectDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.defectDescription}
              </p>
            )}
          </div>
          
          <Link href={`/quality/defect/${result.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const renderHeatNumberResult = (result: any) => (
    <Card key={result.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold">
                Heat {result.heatNumber}
              </h4>
              <Badge variant="outline">
                {result.alloyType?.alloyName || 'Unknown Alloy'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(result.meltDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Batch Size:</span>
                <p>{result.batchSizeKg || 0} kg</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Furnace:</span>
                <p>{result.furnaceId || 'N/A'}</p>
              </div>
              <div>
                <Badge variant={result.status === 'Approved' ? 'default' : 'secondary'}>
                  {result.status || 'Pending'}
                </Badge>
              </div>
            </div>

            {result.qualityCertification && (
              <p className="text-sm text-muted-foreground">
                Cert: {result.qualityCertification}
              </p>
            )}
          </div>
          
          <Link href={`/production/heat/${result.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const renderWorkOrderResult = (result: any) => (
    <Card key={result.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold">
                {result.workOrderNumber}
              </h4>
              <Badge variant={
                result.priorityLevel === 'High' ? 'destructive' :
                result.priorityLevel === 'Medium' ? 'secondary' : 'outline'
              }>
                {result.priorityLevel || 'Medium'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(result.orderDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Quantity:</span>
                <p>{result.quantityOrdered || 0} units</p>
              </div>
              <div>
                <Badge variant={result.status === 'Completed' ? 'default' : 'secondary'}>
                  {result.status || 'Scheduled'}
                </Badge>
              </div>
            </div>

            {result.partSpecification && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.partSpecification}
              </p>
            )}
          </div>
          
          <Link href={`/production/work-order/${result.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const renderResult = (result: any) => {
    switch (searchType) {
      case 'casting-runs':
        return renderCastingRunResult(result)
      case 'quality-inspections':
        return renderQualityInspectionResult(result)
      case 'maintenance-records':
        return renderMaintenanceResult(result)
      case 'defect-records':
        return renderDefectResult(result)
      case 'heat-numbers':
        return renderHeatNumberResult(result)
      case 'work-orders':
        return renderWorkOrderResult(result)
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {results.map(renderResult)}
      
      {results.length > 10 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Showing {results.length} results
          </p>
        </div>
      )}
    </div>
  )
}
