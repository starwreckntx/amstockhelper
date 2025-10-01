
'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface EquipmentStatusChartProps {
  data: Array<{
    id: string
    name: string
    utilization: number
  }>
}

export function EquipmentStatusChart({ data }: EquipmentStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No equipment data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="id" 
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickLine={false}
            label={{ value: 'Utilization %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip />
          <Bar dataKey="utilization" fill="#80D8C3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
