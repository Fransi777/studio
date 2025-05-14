
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { month: "January", healthy: 186, diseased: 80 },
  { month: "February", healthy: 220, diseased: 50 },
  { month: "March", healthy: 250, diseased: 60 },
  { month: "April", healthy: 173, diseased: 90 },
  { month: "May", healthy: 209, diseased: 70 },
  { month: "June", healthy: 214, diseased: 65 },
]

const chartConfig = {
  healthy: {
    label: "Healthy Scans",
    color: "hsl(var(--chart-1))",
  },
  diseased: {
    label: "Diseased Scans",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AnalyticsChartPlaceholder() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Monthly Plant Health Scans</CardTitle>
        <CardDescription>January - June (Sample Data)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="healthy" fill="var(--color-healthy)" radius={4} />
              <Bar dataKey="diseased" fill="var(--color-diseased)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

    