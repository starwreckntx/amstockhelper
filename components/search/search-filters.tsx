
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon, X } from 'lucide-react'

interface SearchFiltersProps {
  searchType: string
  filters: any
  onFiltersChange: (filters: any) => void
  searchOptions: any
}

export function SearchFilters({ searchType, filters, onFiltersChange, searchOptions }: SearchFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    if (value === 'all' || value === '') {
      const newFilters = { ...filters }
      delete newFilters[key]
      onFiltersChange(newFilters)
    } else {
      onFiltersChange({ ...filters, [key]: value })
    }
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  const renderCommonFilters = () => (
    <>
      <div className="space-y-2">
        <Label>Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>
        </div>
      </div>

      {searchOptions?.workOrders && (
        <div className="space-y-2">
          <Label>Work Order</Label>
          <Select value={filters.workOrderId || 'all'} onValueChange={(value) => updateFilter('workOrderId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All work orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Work Orders</SelectItem>
              {searchOptions.workOrders.map((wo: any) => (
                <SelectItem key={wo.id} value={wo.id}>
                  {wo.workOrderNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {searchOptions?.heatNumbers && (
        <div className="space-y-2">
          <Label>Heat Number</Label>
          <Select value={filters.heatNumber || 'all'} onValueChange={(value) => updateFilter('heatNumber', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All heat numbers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Heat Numbers</SelectItem>
              {searchOptions.heatNumbers.map((heat: any) => (
                <SelectItem key={heat.heatNumber} value={heat.heatNumber}>
                  {heat.heatNumber} ({heat.alloyType.alloyName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {searchOptions?.alloyTypes && (
        <div className="space-y-2">
          <Label>Alloy Type</Label>
          <Select value={filters.alloyType || 'all'} onValueChange={(value) => updateFilter('alloyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All alloy types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alloy Types</SelectItem>
              {searchOptions.alloyTypes.map((alloy: any) => (
                <SelectItem key={alloy.id} value={alloy.id}>
                  {alloy.id} - {alloy.alloyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  )

  const renderCastingRunFilters = () => (
    <>
      {renderCommonFilters()}
      <div className="space-y-2">
        <Label>Operator ID</Label>
        <Input
          placeholder="e.g., OP001"
          value={filters.operatorId || ''}
          onChange={(e) => updateFilter('operatorId', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>RPM Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min RPM"
            value={filters.rpmMin || ''}
            onChange={(e) => updateFilter('rpmMin', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max RPM"
            value={filters.rpmMax || ''}
            onChange={(e) => updateFilter('rpmMax', e.target.value)}
          />
        </div>
      </div>
    </>
  )

  const renderQualityInspectionFilters = () => (
    <>
      {renderCommonFilters()}
      <div className="space-y-2">
        <Label>Inspector ID</Label>
        <Input
          placeholder="e.g., QA001"
          value={filters.inspectorId || ''}
          onChange={(e) => updateFilter('inspectorId', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Quality Rating</Label>
        <Select value={filters.qualityRating || 'all'} onValueChange={(value) => updateFilter('qualityRating', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="1">1 - Excellent</SelectItem>
            <SelectItem value="2">2 - Acceptable</SelectItem>
            <SelectItem value="3">3 - Needs Attention</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Pass/Fail Status</Label>
        <Select value={filters.passFailStatus || 'all'} onValueChange={(value) => updateFilter('passFailStatus', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pass">Pass</SelectItem>
            <SelectItem value="Fail">Fail</SelectItem>
            <SelectItem value="Conditional">Conditional</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )

  const renderMaintenanceFilters = () => (
    <>
      <div className="space-y-2">
        <Label>Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>
        </div>
      </div>
      {searchOptions?.equipment && (
        <div className="space-y-2">
          <Label>Equipment</Label>
          <Select value={filters.equipmentId || 'all'} onValueChange={(value) => updateFilter('equipmentId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {searchOptions.equipment.map((eq: any) => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.id} - {eq.equipmentModel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label>Maintenance Type</Label>
        <Select value={filters.maintenanceType || 'all'} onValueChange={(value) => updateFilter('maintenanceType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Routine Inspection">Routine Inspection</SelectItem>
            <SelectItem value="Preventive Maintenance">Preventive Maintenance</SelectItem>
            <SelectItem value="Corrective Maintenance">Corrective Maintenance</SelectItem>
            <SelectItem value="Bearing Replacement">Bearing Replacement</SelectItem>
            <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Technician ID</Label>
        <Input
          placeholder="e.g., TECH001"
          value={filters.technicianId || ''}
          onChange={(e) => updateFilter('technicianId', e.target.value)}
        />
      </div>
    </>
  )

  const renderDefectFilters = () => (
    <>
      {renderCommonFilters()}
      <div className="space-y-2">
        <Label>Defect Type</Label>
        <Select value={filters.defectType || 'all'} onValueChange={(value) => updateFilter('defectType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All defect types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Defect Types</SelectItem>
            <SelectItem value="Porosity">Porosity</SelectItem>
            <SelectItem value="Inclusion">Inclusion</SelectItem>
            <SelectItem value="Crack">Crack</SelectItem>
            <SelectItem value="Dimensional">Dimensional</SelectItem>
            <SelectItem value="Surface">Surface</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Severity</Label>
        <Select value={filters.defectSeverity || 'all'} onValueChange={(value) => updateFilter('defectSeverity', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Minor">Minor</SelectItem>
            <SelectItem value="Major">Major</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )

  const renderFilters = () => {
    switch (searchType) {
      case 'casting-runs':
        return renderCastingRunFilters()
      case 'quality-inspections':
        return renderQualityInspectionFilters()
      case 'maintenance-records':
        return renderMaintenanceFilters()
      case 'defect-records':
        return renderDefectFilters()
      case 'heat-numbers':
        return renderCommonFilters()
      case 'work-orders':
        return (
          <>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={filters.priorityLevel || 'all'} onValueChange={(value) => updateFilter('priorityLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      default:
        return renderCommonFilters()
    }
  }

  return (
    <div className="space-y-4">
      {renderFilters()}
      
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-3 w-3 mr-1" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
