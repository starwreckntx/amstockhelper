
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
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, CheckCircle, Star } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface QualityInspectionData {
  castingRunId: string
  inspectionDate: string
  inspectionTime: string
  inspectorId: string
  inspectionType: string
  overallRating: number
  surfaceQualityRating: number
  internalQualityRating: number
  correctiveActions: string
  passFailStatus: string
  certificationLevel: string
  notes: string
}

interface CastingRunOption {
  id: number
  workOrder: { workOrderNumber: string }
  castingDate: string
  heatNumber: { heatNumber: string }
}

export function QualityInspectionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [castingRuns, setCastingRuns] = useState<CastingRunOption[]>([])
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<QualityInspectionData>()

  const overallRating = watch('overallRating')
  const surfaceRating = watch('surfaceQualityRating')
  const internalRating = watch('internalQualityRating')

  useEffect(() => {
    fetchCastingRuns()
    
    // Set default values
    const now = new Date()
    setValue('inspectionDate', now.toISOString().split('T')[0])
    setValue('inspectionTime', now.toTimeString().split(' ')[0].slice(0, 5))
    setValue('inspectionType', 'Visual & Dimensional')
    setValue('certificationLevel', 'Level 1')
  }, [setValue])

  const fetchCastingRuns = async () => {
    try {
      const response = await fetch('/api/data-entry/casting-runs')
      if (response.ok) {
        const data = await response.json()
        setCastingRuns(data)
      }
    } catch (error) {
      console.error('Error fetching casting runs:', error)
    }
  }

  const onSubmit = async (data: QualityInspectionData) => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/data-entry/quality-inspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          castingRunId: parseInt(data.castingRunId),
          overallRating: parseInt(data.overallRating.toString()),
          surfaceQualityRating: parseInt(data.surfaceQualityRating.toString()),
          internalQualityRating: parseInt(data.internalQualityRating.toString())
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        toast({
          title: "Quality Inspection Recorded",
          description: "Inspection data has been successfully saved.",
        })
        
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save inspection')
      }
    } catch (error) {
      console.error('Error saving inspection:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save inspection",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating === 1) return 'bg-green-500'
    if (rating === 2) return 'bg-yellow-500'
    if (rating === 3) return 'bg-red-500'
    return 'bg-gray-300'
  }

  const getRatingText = (rating: number) => {
    if (rating === 1) return 'Excellent'
    if (rating === 2) return 'Acceptable'
    if (rating === 3) return 'Needs Attention'
    return 'Not Rated'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Quality inspection has been successfully recorded!
          </AlertDescription>
        </Alert>
      )}

      {/* Inspection Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inspection Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="castingRunId">Casting Run *</Label>
            <Select onValueChange={(value) => setValue('castingRunId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select casting run to inspect" />
              </SelectTrigger>
              <SelectContent>
                {castingRuns.map((run) => (
                  <SelectItem key={run.id} value={run.id.toString()}>
                    {run.workOrder.workOrderNumber} - Heat {run.heatNumber.heatNumber} 
                    ({new Date(run.castingDate).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.castingRunId && (
              <p className="text-sm text-red-600">Casting run selection is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspectorId">Inspector ID *</Label>
            <Input
              id="inspectorId"
              placeholder="e.g., QA001"
              {...register('inspectorId', { required: 'Inspector ID is required' })}
            />
            {errors.inspectorId && (
              <p className="text-sm text-red-600">{errors.inspectorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspectionDate">Inspection Date *</Label>
            <Input
              id="inspectionDate"
              type="date"
              {...register('inspectionDate', { required: 'Inspection date is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspectionTime">Inspection Time *</Label>
            <Input
              id="inspectionTime"
              type="time"
              {...register('inspectionTime', { required: 'Inspection time is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspectionType">Inspection Type *</Label>
            <Select onValueChange={(value) => setValue('inspectionType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select inspection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visual & Dimensional">Visual & Dimensional</SelectItem>
                <SelectItem value="Visual & NDT">Visual & NDT</SelectItem>
                <SelectItem value="Full Inspection">Full Inspection</SelectItem>
                <SelectItem value="Dimensional Only">Dimensional Only</SelectItem>
                <SelectItem value="NDT Only">NDT Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificationLevel">Certification Level</Label>
            <Select onValueChange={(value) => setValue('certificationLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select certification level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Level 1">Level 1 - Standard</SelectItem>
                <SelectItem value="Level 2">Level 2 - Enhanced</SelectItem>
                <SelectItem value="Level 3">Level 3 - Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quality Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quality Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate each aspect: 1 = Excellent, 2 = Acceptable, 3 = Needs Attention
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Label htmlFor="overallRating">Overall Rating *</Label>
              <div className="space-y-2">
                <Select onValueChange={(value) => setValue('overallRating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Excellent</SelectItem>
                    <SelectItem value="2">2 - Acceptable</SelectItem>
                    <SelectItem value="3">3 - Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
                {overallRating && (
                  <Badge className={`${getRatingColor(overallRating)} text-white`}>
                    {getRatingText(overallRating)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="surfaceQualityRating">Surface Quality *</Label>
              <div className="space-y-2">
                <Select onValueChange={(value) => setValue('surfaceQualityRating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Excellent</SelectItem>
                    <SelectItem value="2">2 - Acceptable</SelectItem>
                    <SelectItem value="3">3 - Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
                {surfaceRating && (
                  <Badge className={`${getRatingColor(surfaceRating)} text-white`}>
                    {getRatingText(surfaceRating)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="internalQualityRating">Internal Quality *</Label>
              <div className="space-y-2">
                <Select onValueChange={(value) => setValue('internalQualityRating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Excellent</SelectItem>
                    <SelectItem value="2">2 - Acceptable</SelectItem>
                    <SelectItem value="3">3 - Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
                {internalRating && (
                  <Badge className={`${getRatingColor(internalRating)} text-white`}>
                    {getRatingText(internalRating)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passFailStatus">Pass/Fail Status *</Label>
            <Select onValueChange={(value) => setValue('passFailStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pass/fail status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
                <SelectItem value="Conditional">Conditional Pass</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions and Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions and Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="correctiveActions">Corrective Actions</Label>
            <Textarea
              id="correctiveActions"
              placeholder="Describe any corrective actions taken or required..."
              rows={3}
              {...register('correctiveActions')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Inspection Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional observations, measurements, or comments..."
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
              Save Inspection
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
