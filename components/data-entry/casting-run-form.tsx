
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
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface CastingRunData {
  workOrderId: string
  heatId: string
  moldId: string
  shiftNumber: string
  operatorId: string
  castingDate: string
  castingTime: string
  spinnerId: string
  rpmSetting: number
  actualRpm: number
  pourTemperature: number
  ambientTemperature: number
  castingWeightKg: number
  cycleTimeMinutes: number
  packageInfo: string
  operationalGravity: number
  status: string
  notes: string
}

interface FormOptions {
  workOrders: Array<{ id: string; workOrderNumber: string }>
  heatNumbers: Array<{ id: number; heatNumber: string; alloyType: { alloyName: string } }>
  molds: Array<{ id: string; moldType: string; castingSize: string }>
  spinners: Array<{ id: string; equipmentModel: string }>
}

export function CastingRunForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [options, setOptions] = useState<FormOptions | null>(null)
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CastingRunData>()

  useEffect(() => {
    fetchFormOptions()
    
    // Set default values
    const now = new Date()
    setValue('castingDate', now.toISOString().split('T')[0])
    setValue('castingTime', now.toTimeString().split(' ')[0].slice(0, 5))
    setValue('status', 'Completed')
  }, [setValue])

  const fetchFormOptions = async () => {
    try {
      const response = await fetch('/api/data-entry/casting-run-options')
      if (response.ok) {
        const data = await response.json()
        setOptions(data)
      }
    } catch (error) {
      console.error('Error fetching form options:', error)
    }
  }

  const onSubmit = async (data: CastingRunData) => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/data-entry/casting-run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          heatId: parseInt(data.heatId),
          rpmSetting: parseInt(data.rpmSetting.toString()),
          actualRpm: parseInt(data.actualRpm.toString()),
          pourTemperature: parseFloat(data.pourTemperature.toString()),
          ambientTemperature: parseFloat(data.ambientTemperature.toString()),
          castingWeightKg: parseFloat(data.castingWeightKg.toString()),
          cycleTimeMinutes: parseInt(data.cycleTimeMinutes.toString()),
          operationalGravity: parseFloat(data.operationalGravity.toString())
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        toast({
          title: "Casting Run Recorded",
          description: "Production data has been successfully saved.",
        })
        
        // Reset success state after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save casting run')
      }
    } catch (error) {
      console.error('Error saving casting run:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save casting run",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!options) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading form options...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Casting run data has been successfully recorded!
          </AlertDescription>
        </Alert>
      )}

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workOrderId">Work Order *</Label>
            <Select onValueChange={(value) => setValue('workOrderId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select work order" />
              </SelectTrigger>
              <SelectContent>
                {options.workOrders.map((wo) => (
                  <SelectItem key={wo.id} value={wo.id}>
                    {wo.workOrderNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workOrderId && (
              <p className="text-sm text-red-600">Work order is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heatId">Heat Number *</Label>
            <Select onValueChange={(value) => setValue('heatId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select heat number" />
              </SelectTrigger>
              <SelectContent>
                {options.heatNumbers.map((heat) => (
                  <SelectItem key={heat.id} value={heat.id.toString()}>
                    {heat.heatNumber} ({heat.alloyType.alloyName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.heatId && (
              <p className="text-sm text-red-600">Heat number is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="moldId">Mold *</Label>
            <Select onValueChange={(value) => setValue('moldId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mold" />
              </SelectTrigger>
              <SelectContent>
                {options.molds.map((mold) => (
                  <SelectItem key={mold.id} value={mold.id}>
                    {mold.id} - {mold.moldType} ({mold.castingSize})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.moldId && (
              <p className="text-sm text-red-600">Mold selection is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="spinnerId">Spinner Equipment *</Label>
            <Select onValueChange={(value) => setValue('spinnerId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select spinner" />
              </SelectTrigger>
              <SelectContent>
                {options.spinners.map((spinner) => (
                  <SelectItem key={spinner.id} value={spinner.id}>
                    {spinner.id} - {spinner.equipmentModel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.spinnerId && (
              <p className="text-sm text-red-600">Spinner selection is required</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operational Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Operational Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="shiftNumber">Shift *</Label>
            <Select onValueChange={(value) => setValue('shiftNumber', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Shift A (Day)</SelectItem>
                <SelectItem value="B">Shift B (Evening)</SelectItem>
                <SelectItem value="C">Shift C (Night)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operatorId">Operator ID *</Label>
            <Input
              id="operatorId"
              placeholder="e.g., OP001"
              {...register('operatorId', { required: 'Operator ID is required' })}
            />
            {errors.operatorId && (
              <p className="text-sm text-red-600">{errors.operatorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="castingDate">Casting Date *</Label>
            <Input
              id="castingDate"
              type="date"
              {...register('castingDate', { required: 'Casting date is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="castingTime">Casting Time *</Label>
            <Input
              id="castingTime"
              type="time"
              {...register('castingTime', { required: 'Casting time is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageInfo">Package/Batch Info</Label>
            <Input
              id="packageInfo"
              placeholder="e.g., Batch A-001"
              {...register('packageInfo')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Process Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Process Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="rpmSetting">RPM Setting *</Label>
            <Input
              id="rpmSetting"
              type="number"
              placeholder="e.g., 650"
              {...register('rpmSetting', { 
                required: 'RPM setting is required',
                min: { value: 100, message: 'RPM must be at least 100' },
                max: { value: 1000, message: 'RPM must be less than 1000' }
              })}
            />
            {errors.rpmSetting && (
              <p className="text-sm text-red-600">{errors.rpmSetting.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualRpm">Actual RPM *</Label>
            <Input
              id="actualRpm"
              type="number"
              placeholder="e.g., 648"
              {...register('actualRpm', { 
                required: 'Actual RPM is required',
                min: { value: 100, message: 'RPM must be at least 100' },
                max: { value: 1000, message: 'RPM must be less than 1000' }
              })}
            />
            {errors.actualRpm && (
              <p className="text-sm text-red-600">{errors.actualRpm.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pourTemperature">Pour Temperature (°C) *</Label>
            <Input
              id="pourTemperature"
              type="number"
              step="0.1"
              placeholder="e.g., 1495.5"
              {...register('pourTemperature', { 
                required: 'Pour temperature is required',
                min: { value: 1000, message: 'Temperature seems too low' },
                max: { value: 2000, message: 'Temperature seems too high' }
              })}
            />
            {errors.pourTemperature && (
              <p className="text-sm text-red-600">{errors.pourTemperature.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ambientTemperature">Ambient Temp (°C)</Label>
            <Input
              id="ambientTemperature"
              type="number"
              step="0.1"
              placeholder="e.g., 22.5"
              {...register('ambientTemperature')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="castingWeightKg">Casting Weight (kg) *</Label>
            <Input
              id="castingWeightKg"
              type="number"
              step="0.01"
              placeholder="e.g., 23.75"
              {...register('castingWeightKg', { 
                required: 'Casting weight is required',
                min: { value: 0.1, message: 'Weight must be positive' }
              })}
            />
            {errors.castingWeightKg && (
              <p className="text-sm text-red-600">{errors.castingWeightKg.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycleTimeMinutes">Cycle Time (minutes)</Label>
            <Input
              id="cycleTimeMinutes"
              type="number"
              placeholder="e.g., 45"
              {...register('cycleTimeMinutes', {
                min: { value: 1, message: 'Cycle time must be positive' }
              })}
            />
            {errors.cycleTimeMinutes && (
              <p className="text-sm text-red-600">{errors.cycleTimeMinutes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="operationalGravity">Operational Gravity</Label>
            <Input
              id="operationalGravity"
              type="number"
              step="0.001"
              placeholder="e.g., 7.850"
              {...register('operationalGravity')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Production Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations, issues, or comments..."
              rows={3}
              {...register('notes')}
            />
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
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Casting Run
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
