
"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { ScanLine, TrendingUp, AlertTriangle, ListChecks, PieChart, Calendar, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import type { ChartConfig } from "@/components/ui/chart"
import type { AnalyticsSummary } from "@/types"

// Sample data
const sampleChartData = [
  { month: "January", healthy: 186, diseased: 80 },
  { month: "February", healthy: 220, diseased: 50 },
  { month: "March", healthy: 250, diseased: 60 },
  { month: "April", healthy: 173, diseased: 90 },
  { month: "May", healthy: 209, diseased: 70 },
  { month: "June", healthy: 214, diseased: 65 },
]

// Add trend data for line chart
const trendData = [
  { date: "Jan 1", value: 10 },
  { date: "Jan 15", value: 25 },
  { date: "Feb 1", value: 15 },
  { date: "Feb 15", value: 35 },
  { date: "Mar 1", value: 28 },
  { date: "Mar 15", value: 45 },
  { date: "Apr 1", value: 40 },
  { date: "Apr 15", value: 50 },
  { date: "May 1", value: 65 },
  { date: "May 15", value: 58 },
  { date: "Jun 1", value: 70 },
  { date: "Jun 15", value: 85 },
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

const MotionCard = motion(Card)

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary | null
  isLoading: boolean
}

export default function AnalyticsDashboard({ summary, isLoading }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const staggerAnimation = (index: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.1, duration: 0.5 }
  })

  const chartAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  }

  // Calculate health percentage for progress indicator
  const healthyPercentage = summary && summary.totalScans > 0 
    ? Math.round((summary.healthyScans / summary.totalScans) * 100) 
    : 0

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Plant Health Analytics</h1>
          <TabsList className="grid grid-cols-3 w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Monthly</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MotionCard {...staggerAnimation(0)} className="md:col-span-2 shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Plant Health Overview
                  <span className="ml-2 text-xs font-normal py-1 px-2 rounded-full bg-primary/10 text-primary">
                    {healthyPercentage}% Healthy
                  </span>
                </CardTitle>
                <CardDescription>Overall health statistics summary</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div {...chartAnimation} className="h-[200px] w-full">
                  {isLoading ? (
                    <Skeleton className="w-full h-full rounded-md" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sampleChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="healthyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="diseasedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area type="monotone" dataKey="healthy" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#healthyGradient)" />
                        <Area type="monotone" dataKey="diseased" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#diseasedGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </CardContent>
            </MotionCard>

            <MotionCard {...staggerAnimation(1)} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <ScanLine className="h-4 w-4 text-primary" />
                  </span>
                  Plant Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total Scans</p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-12" />
                    ) : (
                      <span className="text-xl font-bold">{summary?.totalScans ?? 0}</span>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Healthy vs Diseased</p>
                      {isLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <span className="text-sm">
                          <span className="text-green-500 font-medium">{summary?.healthyScans ?? 0}</span> / 
                          <span className="text-red-500 font-medium">{summary?.diseasedScans ?? 0}</span>
                        </span>
                      )}
                    </div>
                    
                    {isLoading ? (
                      <Skeleton className="h-2 w-full rounded-full" />
                    ) : (
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${healthyPercentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Most Common Issue</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-full" />
                    ) : (
                      <div className="rounded-lg border p-2 bg-muted/30">
                        <p className="font-medium">
                          {summary?.commonIssues && summary.commonIssues.length > 0 
                            ? summary.commonIssues[0].name 
                            : "No issues detected"}
                        </p>
                        {summary?.commonIssues && summary.commonIssues.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Detected in {summary.commonIssues[0].count} scans
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          </div>

          {summary?.commonIssues && summary.commonIssues.length > 1 && (
            <MotionCard {...staggerAnimation(2)} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-md flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" /> 
                  Common Plant Issues
                </CardTitle>
                <CardDescription>Breakdown of all detected plant health issues</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {summary.commonIssues.map((issue, index) => (
                      <div key={issue.name} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{issue.name}</span>
                            <span className="text-sm">{issue.count} cases</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary/80 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(issue.count / summary.totalScans) * 100}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {summary?.commonIssues?.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground">No specific recurring issues found in recent scans.</p>
                )}
              </CardContent>
            </MotionCard>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <MotionCard {...staggerAnimation(0)} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Plant Health Trends</CardTitle>
              <CardDescription>6-month tracking of scan health patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div {...chartAnimation} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    />
                
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
          </MotionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MotionCard {...staggerAnimation(1)} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scan Volume Analysis</CardTitle>
                <CardDescription>Weekly scan frequency distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div {...chartAnimation} className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { day: "Mon", scans: 12 },
                        { day: "Tue", scans: 19 },
                        { day: "Wed", scans: 8 },
                        { day: "Thu", scans: 15 },
                        { day: "Fri", scans: 14 },
                        { day: "Sat", scans: 22 },
                        { day: "Sun", scans: 17 }
                      ]}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                      <Bar 
                        dataKey="scans" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]} 
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </CardContent>
            </MotionCard>

            <MotionCard {...staggerAnimation(2)} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Issue Recovery Rate</CardTitle>
                <CardDescription>Treatment success over time</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div {...chartAnimation} className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { week: "W1", rate: 65 },
                        { week: "W2", rate: 72 },
                        { week: "W3", rate: 70 },
                        { week: "W4", rate: 78 },
                        { week: "W5", rate: 85 },
                        { week: "W6", rate: 82 }
                      ]}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} domain={[50, 100]} />
                      <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                        activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </CardContent>
            </MotionCard>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <MotionCard {...staggerAnimation(0)} className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Scan Distribution</span>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></span>
                  <span className="text-xs">Healthy</span>
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></span>
                  <span className="text-xs">Diseased</span>
                </div>
              </CardTitle>
              <CardDescription>January - June breakdown (Sample Data)</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div {...chartAnimation} className="min-h-[350px] w-full">
                <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart accessibilityLayer data={sampleChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
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
                      <Bar 
                        dataKey="healthy" 
                        fill="hsl(var(--chart-1))" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        barSize={30}
                      />
                      <Bar 
                        dataKey="diseased" 
                        fill="hsl(var(--chart-2))" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </motion.div>
            </CardContent>
          </MotionCard>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['January', 'February', 'March'].map((month, index) => (
              <MotionCard key={month} {...staggerAnimation(index + 1)} className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{month} Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Total Scans</span>
                    <span className="font-medium">{sampleChartData[index].healthy + sampleChartData[index].diseased}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Health Ratio</span>
                    <span className="font-medium">
                      <span className="text-green-500">{Math.round((sampleChartData[index].healthy / (sampleChartData[index].healthy + sampleChartData[index].diseased)) * 100)}%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(sampleChartData[index].healthy / (sampleChartData[index].healthy + sampleChartData[index].diseased)) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}