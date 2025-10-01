
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { searchType, searchTerm, filters } = await request.json()

    let results: any[] = []

    switch (searchType) {
      case 'casting-runs':
        results = await searchCastingRuns(searchTerm, filters)
        break
      case 'quality-inspections':
        results = await searchQualityInspections(searchTerm, filters)
        break
      case 'maintenance-records':
        results = await searchMaintenanceRecords(searchTerm, filters)
        break
      case 'defect-records':
        results = await searchDefectRecords(searchTerm, filters)
        break
      case 'heat-numbers':
        results = await searchHeatNumbers(searchTerm, filters)
        break
      case 'work-orders':
        results = await searchWorkOrders(searchTerm, filters)
        break
      default:
        results = []
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

async function searchCastingRuns(searchTerm: string, filters: any) {
  const where: any = {}

  // Text search
  if (searchTerm) {
    where.OR = [
      { workOrder: { workOrderNumber: { contains: searchTerm, mode: 'insensitive' } } },
      { operatorId: { contains: searchTerm, mode: 'insensitive' } },
      { notes: { contains: searchTerm, mode: 'insensitive' } },
      { packageInfo: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  // Apply filters
  if (filters.workOrderId) where.workOrderId = filters.workOrderId
  if (filters.heatNumber) where.heatNumber = { heatNumber: filters.heatNumber }
  if (filters.operatorId) where.operatorId = { contains: filters.operatorId, mode: 'insensitive' }
  if (filters.dateFrom || filters.dateTo) {
    where.castingDate = {}
    if (filters.dateFrom) where.castingDate.gte = new Date(filters.dateFrom)
    if (filters.dateTo) where.castingDate.lte = new Date(filters.dateTo)
  }
  if (filters.rpmMin || filters.rpmMax) {
    where.actualRpm = {}
    if (filters.rpmMin) where.actualRpm.gte = parseInt(filters.rpmMin)
    if (filters.rpmMax) where.actualRpm.lte = parseInt(filters.rpmMax)
  }

  return await prisma.castingRun.findMany({
    where,
    include: {
      workOrder: { select: { workOrderNumber: true } },
      heatNumber: { 
        select: { 
          heatNumber: true,
          alloyType: { select: { alloyName: true } }
        } 
      },
      moldSpecification: { select: { moldType: true, castingSize: true } }
    },
    orderBy: { castingDate: 'desc' },
    take: 100
  })
}

async function searchQualityInspections(searchTerm: string, filters: any) {
  const where: any = {}

  if (searchTerm) {
    where.OR = [
      { inspectorId: { contains: searchTerm, mode: 'insensitive' } },
      { notes: { contains: searchTerm, mode: 'insensitive' } },
      { correctiveActions: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  if (filters.inspectorId) where.inspectorId = { contains: filters.inspectorId, mode: 'insensitive' }
  if (filters.qualityRating) where.overallRating = parseInt(filters.qualityRating)
  if (filters.passFailStatus) where.passFailStatus = filters.passFailStatus
  if (filters.dateFrom || filters.dateTo) {
    where.inspectionDate = {}
    if (filters.dateFrom) where.inspectionDate.gte = new Date(filters.dateFrom)
    if (filters.dateTo) where.inspectionDate.lte = new Date(filters.dateTo)
  }

  return await prisma.qualityInspection.findMany({
    where,
    include: {
      castingRun: {
        select: {
          workOrder: { select: { workOrderNumber: true } },
          heatNumber: { select: { heatNumber: true } }
        }
      }
    },
    orderBy: { inspectionDate: 'desc' },
    take: 100
  })
}

async function searchMaintenanceRecords(searchTerm: string, filters: any) {
  const where: any = {}

  if (searchTerm) {
    where.OR = [
      { technicianId: { contains: searchTerm, mode: 'insensitive' } },
      { maintenancePerformed: { contains: searchTerm, mode: 'insensitive' } },
      { notes: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  if (filters.equipmentId) where.spinnerId = filters.equipmentId
  if (filters.maintenanceType) where.maintenanceType = filters.maintenanceType
  if (filters.technicianId) where.technicianId = { contains: filters.technicianId, mode: 'insensitive' }
  if (filters.dateFrom || filters.dateTo) {
    where.maintenanceDate = {}
    if (filters.dateFrom) where.maintenanceDate.gte = new Date(filters.dateFrom)
    if (filters.dateTo) where.maintenanceDate.lte = new Date(filters.dateTo)
  }

  return await prisma.maintenanceRecord.findMany({
    where,
    include: {
      spinnerEquipment: { select: { equipmentModel: true } }
    },
    orderBy: { maintenanceDate: 'desc' },
    take: 100
  })
}

async function searchDefectRecords(searchTerm: string, filters: any) {
  const where: any = {}

  if (searchTerm) {
    where.OR = [
      { defectType: { contains: searchTerm, mode: 'insensitive' } },
      { defectDescription: { contains: searchTerm, mode: 'insensitive' } },
      { probableCause: { contains: searchTerm, mode: 'insensitive' } },
      { correctiveAction: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  if (filters.defectType) where.defectType = filters.defectType
  if (filters.defectSeverity) where.defectSeverity = filters.defectSeverity

  return await prisma.defectRecord.findMany({
    where,
    include: {
      castingRun: {
        select: {
          workOrder: { select: { workOrderNumber: true } },
          heatNumber: { select: { heatNumber: true } }
        }
      },
      qualityInspection: { select: { inspectorId: true, inspectionDate: true } }
    },
    orderBy: { id: 'desc' },
    take: 100
  })
}

async function searchHeatNumbers(searchTerm: string, filters: any) {
  const where: any = {}

  if (searchTerm) {
    where.OR = [
      { heatNumber: { contains: searchTerm, mode: 'insensitive' } },
      { furnaceId: { contains: searchTerm, mode: 'insensitive' } },
      { qualityCertification: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  if (filters.alloyType) where.alloyId = filters.alloyType
  if (filters.dateFrom || filters.dateTo) {
    where.meltDate = {}
    if (filters.dateFrom) where.meltDate.gte = new Date(filters.dateFrom)
    if (filters.dateTo) where.meltDate.lte = new Date(filters.dateTo)
  }

  return await prisma.heatNumber.findMany({
    where,
    include: {
      alloyType: { select: { alloyName: true } }
    },
    orderBy: { heatNumber: 'desc' },
    take: 100
  })
}

async function searchWorkOrders(searchTerm: string, filters: any) {
  const where: any = {}

  if (searchTerm) {
    where.OR = [
      { workOrderNumber: { contains: searchTerm, mode: 'insensitive' } },
      { partSpecification: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  if (filters.priorityLevel) where.priorityLevel = filters.priorityLevel
  if (filters.status) where.status = filters.status
  if (filters.dateFrom || filters.dateTo) {
    where.orderDate = {}
    if (filters.dateFrom) where.orderDate.gte = new Date(filters.dateFrom)
    if (filters.dateTo) where.orderDate.lte = new Date(filters.dateTo)
  }

  return await prisma.workOrder.findMany({
    where,
    orderBy: { createdDate: 'desc' },
    take: 100
  })
}
