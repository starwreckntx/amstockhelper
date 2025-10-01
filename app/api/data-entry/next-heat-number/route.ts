
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Get the highest heat number and increment
    const lastHeat = await prisma.heatNumber.findFirst({
      orderBy: { heatNumber: 'desc' },
      select: { heatNumber: true }
    })

    let nextHeatNumber = '230' // Default starting number
    if (lastHeat?.heatNumber) {
      const currentNumber = parseInt(lastHeat.heatNumber)
      if (!isNaN(currentNumber)) {
        nextHeatNumber = (currentNumber + 1).toString()
      }
    }

    return NextResponse.json({ nextHeatNumber })
  } catch (error) {
    console.error('Error generating next heat number:', error)
    return NextResponse.json(
      { error: 'Failed to generate next heat number' },
      { status: 500 }
    )
  }
}
