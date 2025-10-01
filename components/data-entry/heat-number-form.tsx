
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

interface HeatNumberData {
  heatNumber: string
  alloyId: string
  batchSizeKg: number
  meltDate: string
  meltTime: string
  furnaceId: string
  qualityCertification: string
  status: string
}

interface AlloyOption {
  id: string
  alloyName: string
  meltingTemperatureRange: string
}

export function HeatNumberForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [alloys, setAlloys] = useState<AlloyOption[]>([])
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<HeatNumberData>()

  useEffect(() => {
    fetchAlloys()
    
    // Set default values
    const now = new Date()
    setValue('meltDate', now.toISOString().split('T')[0])
    setValue('meltTime', now.toTimeString().split(' ')[0].slice(0, 5))
    setValue('status', 'Pending')
    
    // Generate heat number (sequential)
    generateHeatNumber()
  }, [setValue])

  const fetchAlloys = async () => {
    try {
      const response = await fetch('/api/data-entry/alloy-types')
      if (response.ok) {
        const data = await response.json()
        setAlloys(data)
      }
    } catch (error) {
      console.error('Error fetching alloys:', error)
    }
  }

  const generateHeatNumber = async () => {
    try {
      const response = await fetch('/api/data-entry/next-heat-number')
      if (response.ok) {
        const data = await response.json()
        setValue('heatNumber', data.nextHeatNumber)
        setValue('qualityCertification', `QC-${new Date().getFullYear()}-${data.nextHeatNumber}`)
      }
    } catch (error) {
      console.error('Error generating heat number:', error)
    }
  }

  const onSubmit = async (data: HeatNumberData) => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/data-entry/heat-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          batchSizeKg: parseFloat(data.batchSizeKg.toString())
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        generateHeatNumber() // Generate next heat number
        toast({
          title: "Heat Number Registered",
          description: "Heat number has been successfully registered.",
        })
        
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register heat number')
      }
    } catch (error) {
      console.error('Error registering heat number:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register heat number",
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
            Heat number has been successfully registered!
          </AlertDescription>
        </Alert>
      )}

      {/* Heat Number Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Heat Number Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="heatNumber">Heat Number *</Label>
            <Input
              id="heatNumber"
              {...register('heatNumber', { required: 'Heat number is required' })}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alloyId">Alloy Type *</Label>
            <Select onValueChange={(value) => setValue('alloyId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select alloy type" />
              </SelectTrigger>
              <SelectContent>
                {alloys.map((alloy) => (
                  <SelectItem key={alloy.id} value={alloy.id}>
                    {alloy.id} - {alloy.alloyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.alloyId && (
              <p className="text-sm text-red-600">Alloy type is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchSizeKg">Batch Size (kg) *</Label>
            <Input
              id="batchSizeKg"
              type="number"
              step="0.01"
              placeholder="e.g., 450.75"
              {...register('batchSizeKg', { 
                required: 'Batch size is required',
                min: { value: 0.1, message: 'Batch size must be positive' }
              })}
            />
            {errors.batchSizeKg && (
              <p className="text-sm text-red-600">{errors.batchSizeKg.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="furnaceId">Furnace ID *</Label>
            <Select onValueChange={(value) => setValue('furnaceId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select furnace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F001">F001 - Primary Furnace</SelectItem>
                <SelectItem value="F002">F002 - Secondary Furnace</SelectItem>
                <SelectItem value="F003">F003 - Backup Furnace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meltDate">Melt Date *</Label>
            <Input
              id="meltDate"
              type="date"
              {...register('meltDate', { required: 'Melt date is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meltTime">Melt Time *</Label>
            <Input
              id="meltTime"
              type="time"
              {...register('meltTime', { required: 'Melt time is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualityCertification">Quality Certification</Label>
            <Input
              id="qualityCertification"
              {...register('qualityCertification')}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            reset()
            generateHeatNumber()
          }}
          disabled={isLoading}
        >
          Clear Form
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Register Heat Number
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
