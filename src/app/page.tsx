
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageUploadForm } from '@/components/ImageUploadForm';
import { DiseaseResults } from '@/components/DiseaseResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';


import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import type { DiagnosisRecord, AnalyticsSummary } from '@/types';
import { getDiagnosisHistory, getAnalyticsSummary } from '@/app/actions';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Microscope, 
  HelpCircle, 
  BarChart as BarChartIcon, 
  CalendarDays, 
  Bell, 
  Info, 
  Loader2,
  AlertCircle,
  FileSymlink,
  Upload,
  ArrowRight,
  ChevronRight,
  Thermometer,
  Droplets,
  Aperture,
  SunMedium,
  History,
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
  Filter,
  Search,
  Leaf
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { DiagnosisHistoryList } from '@/components/DiagnosisHistoryList';
import { Input } from '@/components/ui/input';

export default function PlantIQDashboardPage() {
  const [results, setResults] = useState<DetectDiseaseOutput | null>(null);
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('diagnosis');
  
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(2);

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const historyData = await getDiagnosisHistory();
      setDiagnosisHistory(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history.");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setIsLoadingAnalytics(true);
    try {
      const summaryData = await getAnalyticsSummary();
      setAnalyticsSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics.");
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, fetchHistory, fetchAnalytics]);

  const handleDetectionStart = () => {
    setIsLoadingDiagnosis(true);
    setError(null);
    setResults(null);
    setUploadedImagePreview(null);
    
    // Simulate progress for better UX
    setAnalysisProgress(0);
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      setAnalysisProgress(prev => {
        // Cap at 95% until actual results are in
        if (prev >= 95) return 95;
        return prev + (Math.random() * 10);
      });
    }, 500);
  };

  const handleDetectionComplete = (data: DetectDiseaseOutput, imagePreviewUrl: string) => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    setAnalysisProgress(100);
    
    // Short delay for smooth progress bar completion
    setTimeout(() => {
      setResults(data);
      setUploadedImagePreview(imagePreviewUrl);
      setIsLoadingDiagnosis(false);
      setError(null);
      setActiveTab('diagnosis'); // Switch to diagnosis view
      
      // Optionally refresh history if new diagnosis implies history change
      if (activeTab === 'history') fetchHistory();
      if (activeTab === 'analytics') fetchAnalytics();
    }, 500);
  };

  const handleDetectionError = (errorMessage: string) => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    setError(errorMessage);
    setIsLoadingDiagnosis(false);
    setResults(null);
    setUploadedImagePreview(null);
    setAnalysisProgress(0);
  };

  const [greeting, setGreeting] = useState("Welcome to PlantIQ");
  const [weatherConditions, setWeatherConditions] = useState({
    temp: "24°C",
    humidity: "65%",
    light: "Bright",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning! Ready to check your plants with PlantIQ?");
    else if (hour < 18) setGreeting("Good Afternoon! Let's analyze your plant's health with PlantIQ.");
    else setGreeting("Good Evening! Upload an image to get started with PlantIQ.");
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setWeatherConditions(prev => ({
        ...prev,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // Quick tips content
  const quickTips = [
    "Use natural light when photographing plants for best analysis results.",
    "Capture both healthy and symptomatic parts of the plant for comprehensive diagnosis.",
    "Regular monitoring helps detect issues before they become severe.",
    "Position camera 12-18 inches from plant for optimal detail capture."
  ];
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <Leaf className="h-8 w-8 text-emerald-500" />
            {greeting}
          </motion.h1>
          <p className="mt-1 text-md text-muted-foreground max-w-3xl">
            Your advanced AI assistant for plant disease detection and management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm bg-secondary/50 px-3 py-1 rounded-md">
                  <SunMedium className="h-4 w-4 text-amber-500" />
                  <span>{weatherConditions.time}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm bg-secondary/50 px-3 py-1 rounded-md">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span>{weatherConditions.temp}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ambient temperature</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm bg-secondary/50 px-3 py-1 rounded-md">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{weatherConditions.humidity}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Humidity level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="relative">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>
          
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>PQ</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="diagnosis" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="diagnosis" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900">
            <Microscope className="h-4 w-4 mr-2" />
            Diagnosis
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="diagnosis" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="shadow-lg border-l-4 border-l-emerald-500 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Microscope className="h-6 w-6 text-emerald-600" />
                      Plant Analysis
                    </CardTitle>
                    <CardDescription>
                      Upload a clear image for AI-powered diagnosis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ImageUploadForm
                      onDetectionStart={handleDetectionStart}
                      onDetectionComplete={handleDetectionComplete}
                      onDetectionError={handleDetectionError}
                      isProcessing={isLoadingDiagnosis}
                    />
                    
                    {isLoadingDiagnosis && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Processing image...</span>
                          <span>{Math.round(analysisProgress)}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground animate-pulse text-center mt-2">
                          PlantIQ AI is analyzing leaf patterns and tissue condition
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-md bg-gradient-to-b from-white to-amber-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Quick PlantIQ Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-28">
                      <ul className="space-y-3">
                        {quickTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="mt-0.5">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="shadow-md border-t-4 border-t-orange-400">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="h-5 w-5 text-orange-500" />
                      PlantIQ Alerts
                      <Badge variant="outline" className="ml-auto text-xs font-normal">
                        {notificationCount} New
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-2 rounded-md bg-orange-50 border border-orange-100">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Moisture Alert</p>
                          <p className="text-xs text-muted-foreground">Orchid in living room needs water</p>
                          <p className="text-xs text-orange-600 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-md bg-blue-50 border border-blue-100">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Maintenance Reminder</p>
                          <p className="text-xs text-muted-foreground">Time to fertilize outdoor plants</p>
                          <p className="text-xs text-blue-600 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2"
            >
              <Card className="shadow-xl min-h-[500px] flex flex-col border-b-4 border-b-emerald-500">
                <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    
                    PlantIQ Analysis Report
                  </CardTitle>
                  <CardDescription>
                    Detailed findings from the advanced plant health assessment
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow pt-6">
                  <AnimatePresence mode="wait">
                    {isLoadingDiagnosis && (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 p-4"
                      >
                        <div className="flex gap-4">
                          <Skeleton className="h-40 w-40 rounded-lg flex-shrink-0" />
                          <div className="space-y-3 flex-grow">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="pt-4 flex gap-2">
                              <Skeleton className="h-6 w-20 rounded-full" />
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 pt-4">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-20 w-full rounded-lg" />
                        </div>
                        <p className="text-center text-emerald-600 font-semibold pt-4 animate-pulse">
                          PlantIQ AI is examining leaf patterns and tissue health...
                        </p>
                      </motion.div>
                    )}
                    
                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Alert variant="destructive" className="m-4">
                          <AlertCircle className="h-5 w-5" />
                          <AlertTitle>Analysis Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                    
                    {!isLoadingDiagnosis && !error && results && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <DiseaseResults diagnoses={results.diagnoses} uploadedImage={uploadedImagePreview} />
                      </motion.div>
                    )}
                    
                    {!isLoadingDiagnosis && !error && !results && (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-64 text-center"
                      >
                        <div className="bg-emerald-50 p-6 rounded-full mb-4">
                          <Upload className="h-12 w-12 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-medium">Ready for Plant Analysis</h3>
                        <p className="text-muted-foreground max-w-md mt-2">
                          Upload a clear image of your plant's leaves or stems and PlantIQ will analyze it for potential diseases and provide treatment recommendations.
                        </p>
                        <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
                          <Aperture className="h-4 w-4" />
                          <span>For best results, photograph in natural light</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                
                {results && (
                  <CardFooter className="border-t pt-4 bg-gradient-to-r from-emerald-50 to-transparent">
                    <div className="flex items-center gap-2 w-full">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground flex-grow">
                        Disclaimer: PlantIQ AI analysis provides suggestions and is not a substitute for professional horticultural advice.
                      </p>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <FileSymlink className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <Card className="shadow-xl border-t-4 border-t-blue-500">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl">
                  {isLoadingAnalytics ? (
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  ) : (
                    <BarChartIcon className="h-6 w-6 text-blue-600" />
                  )}
                  PlantIQ Health Analytics
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input className="pl-8 h-9 w-[200px]" placeholder="Search plants..." />
                  </div>
                  
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>
              <CardDescription>
                Visualizing plant health trends and insights over time
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <AnalyticsDashboard summary={analyticsSummary} isLoading={isLoadingAnalytics} />
            </CardContent>
            
            <CardFooter className="border-t pt-4 bg-gradient-to-r from-blue-50 to-transparent">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3"/>
                PlantIQ analytics are based on session data. Configure Firebase for persistent storage.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <Card className="shadow-xl border-t-4 border-t-amber-500">
            <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-transparent">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl">
                  {isLoadingHistory ? (
                    <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
                  ) : (
                    <CalendarDays className="h-6 w-6 text-amber-600" />
                  )}
                  PlantIQ Diagnosis History
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="px-3 py-1 bg-amber-50">
                          <Clock className="h-3 w-3 mr-1" />
                          Last 30 days
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Showing diagnoses from the last 30 days</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="px-3 py-1 bg-emerald-50">
                          <MapPin className="h-3 w-3 mr-1" />
                          All locations
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Showing diagnoses from all plant locations</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardDescription>
                Review past diagnoses and track treatment effectiveness
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <DiagnosisHistoryList history={diagnosisHistory} isLoading={isLoadingHistory} />
            </CardContent>
            
            <CardFooter className="border-t pt-4 bg-gradient-to-r from-amber-50 to-transparent">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3"/>
                PlantIQ diagnosis history is currently session-based. Configure Firebase for persistent storage.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
