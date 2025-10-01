
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [workOrders, heatNumbers, molds, spinners] = await Promise.all([
      prisma.workOrder.findMany({
        select: {
          id: true,
          workOrderNumber: true
        },
        orderBy: { createdDate: 'desc' }
      }),
      prisma.heatNumber.findMany({
        select: {
          id: true,
          heatNumber: true,
          alloyType: {
            select: { alloyName: true }
          }
        },
        orderBy: { heatNumber: 'desc' }
      }),
      prisma.moldSpecification.findMany({
        select: {
          id: true,
          moldType: true,
          castingSize: true
        },
        orderBy: { id: 'asc' }
      }),
      prisma.spinnerEquipment.findMany({
        select: {
          id: true,
          equipmentModel: true
        },
        where: {
          status: 'Active'
        },
        orderBy: { id: 'asc' }
      })
    ])

    return NextResponse.json({
      workOrders,
      heatNumbers,
      molds,
      spinners
    })
  } catch (error) {
    console.error('Error fetching casting run options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form options' },
      { status: 500 }
    )
  }
}
