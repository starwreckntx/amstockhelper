
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const castingRuns = await prisma.castingRun.findMany({
      select: {
        id: true,
        castingDate: true,
        workOrder: {
          select: { workOrderNumber: true }
        },
        heatNumber: {
          select: { heatNumber: true }
        }
      },
      orderBy: { castingDate: 'desc' },
      take: 50 // Limit to recent casting runs
    })

    return NextResponse.json(castingRuns)
  } catch (error) {
    console.error('Error fetching casting runs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch casting runs' },
      { status: 500 }
    )
  }
}
