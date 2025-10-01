
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  Factory,
  ShieldCheck,
  Wrench,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  Thermometer
} from 'lucide-react'
import { ProductionChart } from './production-chart'
import { QualityChart } from './quality-chart'
import { EquipmentStatusChart } from './equipment-status-chart'
import Link from 'next/link'

interface DashboardStats {
  totalCastingRuns: number
  totalDefects: number
  avgQualityRating: number
  equipmentUtilization: number
  recentActivity: Array<{
    id: number
    type: string
    description: string
    time: string
    status: string
  }>
  productionTrends: Array<{
    date: string
    castings: number
    quality: number
  }>
  qualityDistribution: Array<{
    rating: string
    count: number
    percentage: number
  }>
  equipmentStatus: Array<{
    id: string
    name: string
    status: string
    utilization: number
    lastMaintenance: string
  }>
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Unable to load dashboard data</p>
        </CardContent>
      </Card>
    )
  }

  const passRate = stats.totalCastingRuns > 0 
    ? ((stats.totalCastingRuns - stats.totalDefects) / stats.totalCastingRuns * 100)
    : 100

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Castings</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCastingRuns}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Active production runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Pass Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <Progress value={passRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalDefects} defects total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgQualityRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Scale 1-3 (1 = Excellent)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Uptime</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipmentUtilization.toFixed(1)}%</div>
            <Progress value={stats.equipmentUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              All equipment status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
            <CardDescription>
              Daily casting volume and quality performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductionChart data={stats.productionTrends} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Distribution</CardTitle>
            <CardDescription>
              Quality rating breakdown across all castings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QualityChart data={stats.qualityDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Equipment Status and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>
              Current status and utilization of all spinner equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.equipmentStatus.map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Wrench className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{equipment.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {equipment.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      equipment.status === 'Active' ? 'default' :
                      equipment.status === 'Maintenance' ? 'destructive' : 'secondary'
                    }>
                      {equipment.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {equipment.utilization}% utilization
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest production and quality events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.status === 'defect' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {activity.status === 'in-progress' && <Clock className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-center">
              <Link href="/search">
                <Button variant="outline" size="sm">View All Activity</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and data entry points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/data-entry">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                New Casting Run
              </Button>
            </Link>
            <Link href="/quality">
              <Button variant="outline" className="w-full justify-start">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Quality Inspection
              </Button>
            </Link>
            <Link href="/maintenance">
              <Button variant="outline" className="w-full justify-start">
                <Wrench className="mr-2 h-4 w-4" />
                Equipment Maintenance
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Search & Query
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
