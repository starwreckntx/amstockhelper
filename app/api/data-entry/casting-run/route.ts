
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const castingRun = await prisma.castingRun.create({
      data: {
        workOrderId: data.workOrderId,
        heatId: data.heatId,
        moldId: data.moldId,
        shiftNumber: data.shiftNumber,
        operatorId: data.operatorId,
        castingDate: new Date(data.castingDate),
        castingTime: new Date(`1970-01-01T${data.castingTime}:00Z`),
        spinnerId: data.spinnerId,
        rpmSetting: data.rpmSetting,
        actualRpm: data.actualRpm,
        pourTemperature: data.pourTemperature,
        ambientTemperature: data.ambientTemperature,
        castingWeightKg: data.castingWeightKg,
        cycleTimeMinutes: data.cycleTimeMinutes,
        packageInfo: data.packageInfo,
        operationalGravity: data.operationalGravity,
        status: data.status,
        notes: data.notes
      }
    })

    return NextResponse.json(castingRun, { status: 201 })
  } catch (error) {
    console.error('Error creating casting run:', error)
    return NextResponse.json(
      { error: 'Failed to create casting run' },
      { status: 500 }
    )
  }
}
