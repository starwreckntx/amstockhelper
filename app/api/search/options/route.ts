
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [workOrders, heatNumbers, alloyTypes, equipment] = await Promise.all([
      prisma.workOrder.findMany({
        select: {
          id: true,
          workOrderNumber: true
        },
        orderBy: { createdDate: 'desc' },
        take: 100
      }),
      prisma.heatNumber.findMany({
        select: {
          heatNumber: true,
          alloyType: {
            select: { alloyName: true }
          }
        },
        orderBy: { heatNumber: 'desc' },
        take: 100
      }),
      prisma.alloyType.findMany({
        select: {
          id: true,
          alloyName: true
        },
        orderBy: { id: 'asc' }
      }),
      prisma.spinnerEquipment.findMany({
        select: {
          id: true,
          equipmentModel: true
        },
        orderBy: { id: 'asc' }
      })
    ])

    return NextResponse.json({
      workOrders,
      heatNumbers,
      alloyTypes,
      equipment
    })
  } catch (error) {
    console.error('Error fetching search options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search options' },
      { status: 500 }
    )
  }
}
