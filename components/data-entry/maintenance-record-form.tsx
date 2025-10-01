
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
import { Loader2, Save, CheckCircle, Plus, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface MaintenanceRecordData {
  spinnerId: string
  maintenanceDate: string
  maintenanceType: string
  technicianId: string
  currentRpm: number
  targetRpm: number
  vibrationLevel: number
  temperatureReading: number
  maintenancePerformed: string
  cost: number
  nextServiceDate: string
  conditionAfterService: string
  notes: string
}

interface SpinnerOption {
  id: string
  equipmentModel: string
  currentCondition: string
}

interface PartReplaced {
  part: string
  partNumber: string
  quantity: number
}

export function MaintenanceRecordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [spinners, setSpinners] = useState<SpinnerOption[]>([])
  const [partsReplaced, setPartsReplaced] = useState<PartReplaced[]>([])
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MaintenanceRecordData>()

  useEffect(() => {
    fetchSpinners()
    
    // Set default values
    const now = new Date()
    setValue('maintenanceDate', now.toISOString().split('T')[0])
    setValue('conditionAfterService', 'Good')
  }, [setValue])

  const fetchSpinners = async () => {
    try {
      const response = await fetch('/api/data-entry/spinner-equipment')
      if (response.ok) {
        const data = await response.json()
        setSpinners(data)
      }
    } catch (error) {
      console.error('Error fetching spinners:', error)
    }
  }

  const addPart = () => {
    setPartsReplaced([...partsReplaced, { part: '', partNumber: '', quantity: 1 }])
  }

  const removePart = (index: number) => {
    setPartsReplaced(partsReplaced.filter((_, i) => i !== index))
  }

  const updatePart = (index: number, field: keyof PartReplaced, value: string | number) => {
    const updated = [...partsReplaced]
    updated[index] = { ...updated[index], [field]: value }
    setPartsReplaced(updated)
  }

  const onSubmit = async (data: MaintenanceRecordData) => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/data-entry/maintenance-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          currentRpm: parseInt(data.currentRpm.toString()),
          targetRpm: parseInt(data.targetRpm.toString()),
          vibrationLevel: parseFloat(data.vibrationLevel.toString()),
          temperatureReading: parseFloat(data.temperatureReading.toString()),
          cost: parseFloat(data.cost.toString()),
          partsReplaced: partsReplaced.filter(part => part.part && part.partNumber)
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        setPartsReplaced([])
        toast({
          title: "Maintenance Record Saved",
          description: "Maintenance data has been successfully recorded.",
        })
        
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save maintenance record')
      }
    } catch (error) {
      console.error('Error saving maintenance record:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save maintenance record",
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
            Maintenance record has been successfully saved!
          </AlertDescription>
        </Alert>
      )}

      {/* Equipment and Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Equipment and Service Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="spinnerId">Spinner Equipment *</Label>
            <Select onValueChange={(value) => setValue('spinnerId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select spinner equipment" />
              </SelectTrigger>
              <SelectContent>
                {spinners.map((spinner) => (
                  <SelectItem key={spinner.id} value={spinner.id}>
                    {spinner.id} - {spinner.equipmentModel} ({spinner.currentCondition})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.spinnerId && (
              <p className="text-sm text-red-600">Equipment selection is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="technicianId">Technician ID *</Label>
            <Input
              id="technicianId"
              placeholder="e.g., TECH001"
              {...register('technicianId', { required: 'Technician ID is required' })}
            />
            {errors.technicianId && (
              <p className="text-sm text-red-600">{errors.technicianId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceDate">Maintenance Date *</Label>
            <Input
              id="maintenanceDate"
              type="date"
              {...register('maintenanceDate', { required: 'Maintenance date is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceType">Maintenance Type *</Label>
            <Select onValueChange={(value) => setValue('maintenanceType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine Inspection">Routine Inspection</SelectItem>
                <SelectItem value="Preventive Maintenance">Preventive Maintenance</SelectItem>
                <SelectItem value="Corrective Maintenance">Corrective Maintenance</SelectItem>
                <SelectItem value="Bearing Replacement">Bearing Replacement</SelectItem>
                <SelectItem value="Lubrication Service">Lubrication Service</SelectItem>
                <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
                <SelectItem value="Overhaul">Major Overhaul</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextServiceDate">Next Service Date</Label>
            <Input
              id="nextServiceDate"
              type="date"
              {...register('nextServiceDate')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Measurements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentRpm">Current RPM</Label>
            <Input
              id="currentRpm"
              type="number"
              placeholder="e.g., 650"
              {...register('currentRpm')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetRpm">Target RPM</Label>
            <Input
              id="targetRpm"
              type="number"
              placeholder="e.g., 650"
              {...register('targetRpm')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vibrationLevel">Vibration Level</Label>
            <Input
              id="vibrationLevel"
              type="number"
              step="0.001"
              placeholder="e.g., 2.1"
              {...register('vibrationLevel')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperatureReading">Temperature Reading (°C)</Label>
            <Input
              id="temperatureReading"
              type="number"
              step="0.1"
              placeholder="e.g., 45.5"
              {...register('temperatureReading')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Maintenance Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              placeholder="e.g., 125.00"
              {...register('cost')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditionAfterService">Condition After Service</Label>
            <Select onValueChange={(value) => setValue('conditionAfterService', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parts Replaced */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Parts Replaced
            <Button type="button" variant="outline" size="sm" onClick={addPart}>
              <Plus className="h-4 w-4 mr-1" />
              Add Part
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {partsReplaced.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No parts replaced. Click "Add Part" to record replaced parts.
            </p>
          ) : (
            <div className="space-y-4">
              {partsReplaced.map((part, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 items-end border p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label>Part Name</Label>
                    <Input
                      placeholder="e.g., Main bearing set"
                      value={part.part}
                      onChange={(e) => updatePart(index, 'part', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Part Number</Label>
                    <Input
                      placeholder="e.g., BRG-2000-MS"
                      value={part.partNumber}
                      onChange={(e) => updatePart(index, 'partNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={part.quantity}
                      onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removePart(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Performed and Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Work Performed and Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maintenancePerformed">Maintenance Performed *</Label>
            <Textarea
              id="maintenancePerformed"
              placeholder="Describe the maintenance work performed..."
              rows={3}
              {...register('maintenancePerformed', { required: 'Description of work is required' })}
            />
            {errors.maintenancePerformed && (
              <p className="text-sm text-red-600">{errors.maintenancePerformed.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations or recommendations..."
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
          onClick={() => {
            reset()
            setPartsReplaced([])
          }}
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
              Save Maintenance Record
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
