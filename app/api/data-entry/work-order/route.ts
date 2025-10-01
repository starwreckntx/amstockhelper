
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const workOrder = await prisma.workOrder.create({
      data: {
        id: data.id,
        workOrderNumber: data.workOrderNumber,
        customerId: data.customerId,
        partSpecification: data.partSpecification,
        quantityOrdered: data.quantityOrdered,
        orderDate: new Date(data.orderDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priorityLevel: data.priorityLevel,
        status: data.status
      }
    })

    return NextResponse.json(workOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { error: 'Failed to create work order' },
      { status: 500 }
    )
  }
}
