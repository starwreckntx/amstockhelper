
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const spinners = await prisma.spinnerEquipment.findMany({
      select: {
        id: true,
        equipmentModel: true,
        currentCondition: true
      },
      orderBy: { id: 'asc' }
    })

    return NextResponse.json(spinners)
  } catch (error) {
    console.error('Error fetching spinner equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spinner equipment' },
      { status: 500 }
    )
  }
}
