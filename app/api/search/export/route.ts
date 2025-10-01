
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { searchType, results } = await request.json()

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'No results to export' },
        { status: 400 }
      )
    }

    let csvContent = ''
    let headers = []

    switch (searchType) {
      case 'casting-runs':
        headers = [
          'Casting Run ID',
          'Work Order',
          'Heat Number',
          'Alloy Type',
          'Casting Date',
          'Operator ID',
          'RPM Setting',
          'Actual RPM',
          'Pour Temperature',
          'Casting Weight (kg)',
          'Status',
          'Notes'
        ]
        csvContent = results.map((r: any) => [
          r.id,
          r.workOrder?.workOrderNumber || '',
          r.heatNumber?.heatNumber || '',
          r.heatNumber?.alloyType?.alloyName || '',
          new Date(r.castingDate).toLocaleDateString(),
          r.operatorId || '',
          r.rpmSetting || '',
          r.actualRpm || '',
          r.pourTemperature || '',
          r.castingWeightKg || '',
          r.status || '',
          r.notes || ''
        ]).map((row: any[]) => row.join(',')).join('\n')
        break

      case 'quality-inspections':
        headers = [
          'Inspection ID',
          'Work Order',
          'Inspection Date',
          'Inspector ID',
          'Inspection Type',
          'Overall Rating',
          'Surface Rating',
          'Internal Rating',
          'Pass/Fail Status',
          'Corrective Actions',
          'Notes'
        ]
        csvContent = results.map((r: any) => [
          r.id,
          r.castingRun?.workOrder?.workOrderNumber || '',
          new Date(r.inspectionDate).toLocaleDateString(),
          r.inspectorId || '',
          r.inspectionType || '',
          r.overallRating || '',
          r.surfaceQualityRating || '',
          r.internalQualityRating || '',
          r.passFailStatus || '',
          r.correctiveActions || '',
          r.notes || ''
        ]).map((row: any[]) => row.join(',')).join('\n')
        break

      case 'maintenance-records':
        headers = [
          'Maintenance ID',
          'Equipment ID',
          'Equipment Model',
          'Maintenance Date',
          'Maintenance Type',
          'Technician ID',
          'Current RPM',
          'Target RPM',
          'Vibration Level',
          'Temperature Reading',
          'Cost',
          'Condition After Service',
          'Notes'
        ]
        csvContent = results.map((r: any) => [
          r.id,
          r.spinnerId || '',
          r.spinnerEquipment?.equipmentModel || '',
          new Date(r.maintenanceDate).toLocaleDateString(),
          r.maintenanceType || '',
          r.technicianId || '',
          r.currentRpm || '',
          r.targetRpm || '',
          r.vibrationLevel || '',
          r.temperatureReading || '',
          r.cost || '',
          r.conditionAfterService || '',
          r.notes || ''
        ]).map((row: any[]) => row.join(',')).join('\n')
        break

      case 'defect-records':
        headers = [
          'Defect ID',
          'Work Order',
          'Heat Number',
          'Defect Type',
          'Severity',
          'Location',
          'Description',
          'Probable Cause',
          'Corrective Action',
          'Cost Impact',
          'Status'
        ]
        csvContent = results.map((r: any) => [
          r.id,
          r.castingRun?.workOrder?.workOrderNumber || '',
          r.castingRun?.heatNumber?.heatNumber || '',
          r.defectType || '',
          r.defectSeverity || '',
          r.defectLocation || '',
          r.defectDescription || '',
          r.probableCause || '',
          r.correctiveAction || '',
          r.costImpact || '',
          r.status || ''
        ]).map((row: any[]) => row.join(',')).join('\n')
        break

      case 'heat-numbers':
        headers = [
          'Heat ID',
          'Heat Number',
          'Alloy Type',
          'Batch Size (kg)',
          'Melt Date',
          'Furnace ID',
          'Quality Certification',
          'Status'
        ]
        csvContent = results.map((r: any) => [
          r.id,
          r.heatNumber || '',
          r.alloyType?.alloyName || '',
          r.batchSizeKg || '',
          new Date(r.meltDate).toLocaleDateString(),
          r.furnaceId || '',
          r.qualityCertification || '',
          r.status || ''
        ]).map((row: any[]) => row.join(',')).join('\n')
        break

      case 'work-orders':
        headers = [
          'Work Order ID',
          'Work Order Number',
          'Customer ID',
          'Part Specification',
          'Quantity Ordered',
          'Order Date',
          'Due Date',
          'Priority Level',
          'Status'
        ]
        csvContent = results.map((r: any) => [
          r.id,
          r.workOrderNumber || '',
          r.customerId || '',
          r.partSpecification || '',
          r.quantityOrdered || '',
          new Date(r.orderDate).toLocaleDateString(),
          r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '',
          r.priorityLevel || '',
          r.status || ''
        ]).map((row: any[]) => row.join(',')).join('\n')
        break

      default:
        return NextResponse.json(
          { error: 'Invalid search type' },
          { status: 400 }
        )
    }

    const csvData = headers.join(',') + '\n' + csvContent

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="foundry-${searchType}-export.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}
