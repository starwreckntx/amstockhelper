
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const heatNumber = await prisma.heatNumber.create({
      data: {
        heatNumber: data.heatNumber,
        alloyId: data.alloyId,
        batchSizeKg: data.batchSizeKg,
        meltDate: new Date(data.meltDate),
        meltTime: new Date(`1970-01-01T${data.meltTime}:00Z`),
        furnaceId: data.furnaceId,
        qualityCertification: data.qualityCertification,
        status: data.status
      }
    })

    return NextResponse.json(heatNumber, { status: 201 })
  } catch (error) {
    console.error('Error creating heat number:', error)
    return NextResponse.json(
      { error: 'Failed to create heat number' },
      { status: 500 }
    )
  }
}
