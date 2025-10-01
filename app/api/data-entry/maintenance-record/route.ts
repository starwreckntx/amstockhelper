
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const maintenanceRecord = await prisma.maintenanceRecord.create({
      data: {
        spinnerId: data.spinnerId,
        maintenanceDate: new Date(data.maintenanceDate),
        maintenanceType: data.maintenanceType,
        technicianId: data.technicianId,
        currentRpm: data.currentRpm,
        targetRpm: data.targetRpm,
        vibrationLevel: data.vibrationLevel,
        temperatureReading: data.temperatureReading,
        maintenancePerformed: data.maintenancePerformed,
        partsReplaced: data.partsReplaced || [],
        cost: data.cost,
        nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate) : null,
        conditionAfterService: data.conditionAfterService,
        notes: data.notes
      }
    })

    return NextResponse.json(maintenanceRecord, { status: 201 })
  } catch (error) {
    console.error('Error creating maintenance record:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance record' },
      { status: 500 }
    )
  }
}
