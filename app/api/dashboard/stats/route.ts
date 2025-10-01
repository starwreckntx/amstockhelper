
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Get total casting runs
    const totalCastingRuns = await prisma.castingRun.count()

    // Get total defects
    const totalDefects = await prisma.defectRecord.count()

    // Calculate average quality rating
    const qualityInspections = await prisma.qualityInspection.findMany({
      select: { overallRating: true },
      where: { overallRating: { not: null } }
    })
    
    const avgQualityRating = qualityInspections.length > 0
      ? qualityInspections.reduce((sum, inspection) => sum + (inspection.overallRating || 0), 0) / qualityInspections.length
      : 0

    // Get equipment status
    const equipmentStatus = await prisma.spinnerEquipment.findMany({
      select: {
        id: true,
        equipmentModel: true,
        status: true,
        currentCondition: true,
        totalOperatingHours: true,
        maintenanceRecords: {
          select: { maintenanceDate: true },
          orderBy: { maintenanceDate: 'desc' },
          take: 1
        }
      }
    })

    // Calculate equipment utilization (simplified)
    const equipmentUtilization = equipmentStatus.length > 0
      ? (equipmentStatus.filter(eq => eq.status === 'Active').length / equipmentStatus.length) * 100
      : 0

    // Get recent activity (casting runs and inspections)
    const recentCastings = await prisma.castingRun.findMany({
      select: {
        id: true,
        castingDate: true,
        status: true,
        workOrder: { select: { workOrderNumber: true } }
      },
      orderBy: { castingDate: 'desc' },
      take: 5
    })

    const recentInspections = await prisma.qualityInspection.findMany({
      select: {
        id: true,
        inspectionDate: true,
        passFailStatus: true,
        castingRun: {
          select: { workOrder: { select: { workOrderNumber: true } } }
        }
      },
      orderBy: { inspectionDate: 'desc' },
      take: 5
    })

    // Format recent activity
    const recentActivity = [
      ...recentCastings.map(casting => ({
        id: casting.id,
        type: 'casting',
        description: `Casting completed for ${casting.workOrder?.workOrderNumber || 'Unknown WO'}`,
        time: casting.castingDate?.toLocaleDateString() || 'Unknown',
        status: casting.status?.toLowerCase() === 'completed' ? 'completed' : 'in-progress'
      })),
      ...recentInspections.map(inspection => ({
        id: inspection.id,
        type: 'inspection',
        description: `Quality inspection for ${inspection.castingRun?.workOrder?.workOrderNumber || 'Unknown WO'}`,
        time: inspection.inspectionDate?.toLocaleDateString() || 'Unknown',
        status: inspection.passFailStatus?.toLowerCase() === 'pass' ? 'completed' : 'defect'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)

    // Get production trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const productionTrends = await Promise.all(
      last7Days.map(async (date) => {
        const castings = await prisma.castingRun.count({
          where: {
            castingDate: {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
            }
          }
        })

        const inspections = await prisma.qualityInspection.findMany({
          where: {
            inspectionDate: {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
            },
            overallRating: { not: null }
          },
          select: { overallRating: true }
        })

        const avgQuality = inspections.length > 0
          ? inspections.reduce((sum, insp) => sum + (insp.overallRating || 0), 0) / inspections.length
          : 0

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          castings,
          quality: avgQuality
        }
      })
    )

    // Get quality distribution
    const qualityDistribution = [
      { rating: 'Excellent (1)', count: 0, percentage: 0 },
      { rating: 'Good (2)', count: 0, percentage: 0 },
      { rating: 'Needs Attention (3)', count: 0, percentage: 0 }
    ]

    qualityInspections.forEach(inspection => {
      if (inspection.overallRating === 1) qualityDistribution[0].count++
      else if (inspection.overallRating === 2) qualityDistribution[1].count++
      else if (inspection.overallRating === 3) qualityDistribution[2].count++
    })

    const totalInspections = qualityInspections.length
    if (totalInspections > 0) {
      qualityDistribution.forEach(item => {
        item.percentage = (item.count / totalInspections) * 100
      })
    }

    const response = {
      totalCastingRuns,
      totalDefects,
      avgQualityRating,
      equipmentUtilization,
      recentActivity,
      productionTrends,
      qualityDistribution,
      equipmentStatus: equipmentStatus.map(eq => ({
        id: eq.id,
        name: eq.equipmentModel || `Equipment ${eq.id}`,
        status: eq.status || 'Unknown',
        utilization: Math.random() * 100, // Placeholder calculation
        lastMaintenance: eq.maintenanceRecords[0]?.maintenanceDate?.toLocaleDateString() || 'Never'
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
