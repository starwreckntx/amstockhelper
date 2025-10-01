
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Factory,
  ShieldCheck,
  Wrench,
  FileText,
  Thermometer,
  Package,
  Settings,
  Clock
} from 'lucide-react'
import { CastingRunForm } from './casting-run-form'
import { QualityInspectionForm } from './quality-inspection-form'
import { MaintenanceRecordForm } from './maintenance-record-form'
import { WorkOrderForm } from './work-order-form'
import { HeatNumberForm } from './heat-number-form'

export function DataEntryHub() {
  const [activeTab, setActiveTab] = useState('casting-run')

  const entryTypes = [
    {
      id: 'casting-run',
      title: 'Casting Run',
      description: 'Production Data Report (PDR)',
      icon: Factory,
      color: 'bg-blue-500',
      count: 'Most Used'
    },
    {
      id: 'quality-inspection',
      title: 'Quality Inspection',
      description: 'QA assessment and ratings',
      icon: ShieldCheck,
      color: 'bg-green-500',
      count: 'QA Required'
    },
    {
      id: 'maintenance-record',
      title: 'Maintenance Record',
      description: 'Equipment service log',
      icon: Wrench,
      color: 'bg-orange-500',
      count: 'Scheduled'
    },
    {
      id: 'work-order',
      title: 'Work Order',
      description: 'Job tracking and scheduling',
      icon: FileText,
      color: 'bg-purple-500',
      count: 'Planning'
    },
    {
      id: 'heat-number',
      title: 'Heat Number',
      description: 'Material batch traceability',
      icon: Thermometer,
      color: 'bg-red-500',
      count: 'Traceability'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {entryTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === type.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveTab(type.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${type.color}`}>
                  <type.icon className="h-4 w-4 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {type.count}
                </Badge>
              </div>
              <CardTitle className="text-sm">{type.title}</CardTitle>
              <CardDescription className="text-xs">
                {type.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Data Entry Forms */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {entryTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="text-xs">
              <type.icon className="h-3 w-3 mr-1" />
              {type.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="casting-run">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Factory className="h-5 w-5 mr-2" />
                Production Data Report (PDR)
              </CardTitle>
              <CardDescription>
                Record casting run details including parameters, materials, and operational data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CastingRunForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality-inspection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2" />
                Quality Inspection Form
              </CardTitle>
              <CardDescription>
                Document quality assessment results and defect identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QualityInspectionForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance-record">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Equipment Maintenance Log
              </CardTitle>
              <CardDescription>
                Log maintenance activities, parts replaced, and equipment condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceRecordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-order">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Work Order Entry
              </CardTitle>
              <CardDescription>
                Create and manage production work orders and job specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkOrderForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heat-number">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                Heat Number Registration
              </CardTitle>
              <CardDescription>
                Register new heat numbers with material batch information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeatNumberForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
