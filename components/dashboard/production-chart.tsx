
'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface ProductionChartProps {
  data: Array<{
    date: string
    castings: number
    quality: number
  }>
}

export function ProductionChart({ data }: ProductionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No production data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line 
            type="monotone" 
            dataKey="castings" 
            stroke="#60B5FF" 
            strokeWidth={2}
            name="Daily Castings"
          />
          <Line 
            type="monotone" 
            dataKey="quality" 
            stroke="#FF9149" 
            strokeWidth={2}
            name="Avg Quality"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
