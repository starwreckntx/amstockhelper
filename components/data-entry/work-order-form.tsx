
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface WorkOrderData {
  id: string
  workOrderNumber: string
  customerId: number
  partSpecification: string
  quantityOrdered: number
  orderDate: string
  dueDate: string
  priorityLevel: string
  status: string
}

export function WorkOrderForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<WorkOrderData>()

  useEffect(() => {
    // Set default values
    const now = new Date()
    setValue('orderDate', now.toISOString().split('T')[0])
    setValue('status', 'Scheduled')
    setValue('priorityLevel', 'Medium')
    
    // Generate work order number
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const time = now.getTime().toString().slice(-3)
    setValue('workOrderNumber', `WO-${year}${month}${day}-${time}`)
    setValue('id', `${year}-${month}-${time}`)
  }, [setValue])

  const onSubmit = async (data: WorkOrderData) => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/data-entry/work-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          customerId: parseInt(data.customerId.toString()),
          quantityOrdered: parseInt(data.quantityOrdered.toString())
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        toast({
          title: "Work Order Created",
          description: "Work order has been successfully created.",
        })
        
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create work order')
      }
    } catch (error) {
      console.error('Error creating work order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create work order",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Work order has been successfully created!
          </AlertDescription>
        </Alert>
      )}

      {/* Work Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Work Order Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workOrderNumber">Work Order Number *</Label>
            <Input
              id="workOrderNumber"
              {...register('workOrderNumber', { required: 'Work order number is required' })}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID *</Label>
            <Input
              id="customerId"
              type="number"
              placeholder="e.g., 1001"
              {...register('customerId', { 
                required: 'Customer ID is required',
                min: { value: 1, message: 'Customer ID must be positive' }
              })}
            />
            {errors.customerId && (
              <p className="text-sm text-red-600">{errors.customerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantityOrdered">Quantity Ordered *</Label>
            <Input
              id="quantityOrdered"
              type="number"
              placeholder="e.g., 5"
              {...register('quantityOrdered', { 
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' }
              })}
            />
            {errors.quantityOrdered && (
              <p className="text-sm text-red-600">{errors.quantityOrdered.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorityLevel">Priority Level</Label>
            <Select onValueChange={(value) => setValue('priorityLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderDate">Order Date *</Label>
            <Input
              id="orderDate"
              type="date"
              {...register('orderDate', { required: 'Order date is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Part Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="partSpecification">Part Specification *</Label>
            <Textarea
              id="partSpecification"
              placeholder="Detailed part specifications, dimensions, material requirements, quality standards, etc..."
              rows={4}
              {...register('partSpecification', { required: 'Part specification is required' })}
            />
            {errors.partSpecification && (
              <p className="text-sm text-red-600">{errors.partSpecification.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => reset()}
          disabled={isLoading}
        >
          Clear Form
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Work Order
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
