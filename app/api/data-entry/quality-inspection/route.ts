
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const qualityInspection = await prisma.qualityInspection.create({
      data: {
        castingRunId: data.castingRunId,
        inspectionDate: new Date(data.inspectionDate),
        inspectionTime: new Date(`1970-01-01T${data.inspectionTime}:00Z`),
        inspectorId: data.inspectorId,
        inspectionType: data.inspectionType,
        overallRating: data.overallRating,
        surfaceQualityRating: data.surfaceQualityRating,
        internalQualityRating: data.internalQualityRating,
        correctiveActions: data.correctiveActions,
        passFailStatus: data.passFailStatus,
        certificationLevel: data.certificationLevel,
        notes: data.notes
      }
    })

    return NextResponse.json(qualityInspection, { status: 201 })
  } catch (error) {
    console.error('Error creating quality inspection:', error)
    return NextResponse.json(
      { error: 'Failed to create quality inspection' },
      { status: 500 }
    )
  }
}
