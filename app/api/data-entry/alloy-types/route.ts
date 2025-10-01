
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const alloys = await prisma.alloyType.findMany({
      select: {
        id: true,
        alloyName: true,
        meltingTemperatureRange: true
      },
      orderBy: { id: 'asc' }
    })

    return NextResponse.json(alloys)
  } catch (error) {
    console.error('Error fetching alloy types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alloy types' },
      { status: 500 }
    )
  }
}
