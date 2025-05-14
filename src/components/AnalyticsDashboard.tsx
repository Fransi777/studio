
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { AnalyticsSummary } from "@/types";
import { TrendingUp, AlertTriangle, ScanLine, ListChecks } from "lucide-react";

const sampleChartData = [
  { month: "January", healthy: 186, diseased: 80 },
  { month: "February", healthy: 220, diseased: 50 },
  { month: "March", healthy: 250, diseased: 60 },
  { month: "April", healthy: 173, diseased: 90 },
  { month: "May", healthy: 209, diseased: 70 },
  { month: "June", healthy: 214, diseased: 65 },
];

const chartConfig = {
  healthy: {
    label: "Healthy Scans",
    color: "hsl(var(--chart-1))",
  },
  diseased: {
    label: "Diseased Scans",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary | null;
  isLoading: boolean;
}

export function AnalyticsDashboard({ summary, isLoading }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Monthly Plant Health Scans</CardTitle>
          <CardDescription>January - June (Sample Data - Chart data will be dynamic in a future update)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart accessibilityLayer data={sampleChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <ScanLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="w-1/2 h-8" /> : <div className="text-2xl font-bold">{summary?.totalScans ?? 0}</div>}
                <p className="text-xs text-muted-foreground mt-1">
                  {isLoading ? <Skeleton className="w-3/4 h-4" /> : `Across all your plants.`}
                </p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy vs Diseased</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 {isLoading ? <Skeleton className="w-1/2 h-8" /> : (
                    <div className="text-2xl font-bold">
                        {summary?.healthyScans ?? 0} <span className="text-green-500">H</span> / {summary?.diseasedScans ?? 0} <span className="text-red-500">D</span>
                    </div>
                 )}
                <p className="text-xs text-muted-foreground mt-1">
                    {isLoading ? <Skeleton className="w-3/4 h-4" /> : `Ratio of healthy to diseased scans.`}
                </p>
              </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common Issue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="w-3/4 h-8" /> : (
                <div className="text-xl font-bold">
                  {summary?.commonIssues && summary.commonIssues.length > 0 ? summary.commonIssues[0].name : "N/A"}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? <Skeleton className="w-full h-4" /> : (
                   summary?.commonIssues && summary.commonIssues.length > 0 ? `Appeared ${summary.commonIssues[0].count} times.` : "No common issues identified yet."
                )}
              </p>
            </CardContent>
          </Card>
      </div>
       {summary?.commonIssues && summary.commonIssues.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-md flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/> Other Detected Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ): (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {summary.commonIssues.slice(1).map(issue => (
                    <li key={issue.name} className="flex justify-between">
                      <span>{issue.name}</span>
                      <span className="font-medium text-foreground">{issue.count} cases</span>
                    </li>
                  ))}
                </ul>
              )}
               {summary?.commonIssues?.length === 0 && !isLoading && (
                <p className="text-sm text-muted-foreground">No specific recurring issues found in recent scans.</p>
               )}
            </CardContent>
          </Card>
        )}
    </div>
  )
}
