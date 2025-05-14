
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageUploadForm } from '@/components/ImageUploadForm';
import { DiseaseResults } from '@/components/DiseaseResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import type { DiagnosisRecord, AnalyticsSummary } from '@/types';
import { getDiagnosisHistory, getAnalyticsSummary } from '@/app/actions';
import { ShieldAlert, CheckCircle2, Microscope, HelpCircle, BarChart as BarChartIcon, CalendarDays, Bell, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { DiagnosisHistoryList } from '@/components/DiagnosisHistoryList';

export default function PlantIQDashboardPage() {
  const [results, setResults] = useState<DetectDiseaseOutput | null>(null);
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  const [currentSection, setCurrentSection] = useState<'diagnosis' | 'analytics' | 'history'>('diagnosis');

  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

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
    if (currentSection === 'history') {
      fetchHistory();
    } else if (currentSection === 'analytics') {
      fetchAnalytics();
    }
  }, [currentSection, fetchHistory, fetchAnalytics]);

  const handleDetectionStart = () => {
    setIsLoadingDiagnosis(true);
    setError(null);
    setResults(null);
    setUploadedImagePreview(null); 
  };

  const handleDetectionComplete = (data: DetectDiseaseOutput, imagePreviewUrl: string) => {
    setResults(data);
    setUploadedImagePreview(imagePreviewUrl);
    setIsLoadingDiagnosis(false);
    setError(null);
    setCurrentSection('diagnosis'); // Switch to diagnosis view
    // Optionally refresh history if new diagnosis implies history change
    if (currentSection === 'history') fetchHistory();
    if (currentSection === 'analytics') fetchAnalytics();
  };

  const handleDetectionError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoadingDiagnosis(false);
    setResults(null);
    setUploadedImagePreview(null);
  };

  const [greeting, setGreeting] = useState("Welcome to PlantIQ");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning! Ready to check your plants with PlantIQ?");
    else if (hour < 18) setGreeting("Good Afternoon! Let's analyze your plant's health with PlantIQ.");
    else setGreeting("Good Evening! Upload an image to get started with PlantIQ.");
  }, []);

  const renderSectionTitleIcon = () => {
    if (isLoadingDiagnosis && currentSection === 'diagnosis') return <ShieldAlert className="h-6 w-6 text-primary animate-pulse" />;
    if (currentSection === 'diagnosis') return results ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <HelpCircle className="h-6 w-6 text-primary" />;
    if (currentSection === 'analytics') return isLoadingAnalytics ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <BarChartIcon className="h-6 w-6 text-primary" />;
    if (currentSection === 'history') return isLoadingHistory ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <CalendarDays className="h-6 w-6 text-primary" />;
    return <HelpCircle className="h-6 w-6 text-primary" />;
  };
  
  const renderSectionTitle = () => {
    if (currentSection === 'diagnosis') return 'PlantIQ Analysis Report';
    if (currentSection === 'analytics') return 'PlantIQ Health Analytics';
    if (currentSection === 'history') return 'PlantIQ Diagnosis History & Outcomes';
    return 'PlantIQ Analysis Report';
  };

  const renderSectionDescription = () => {
    if (currentSection === 'diagnosis') return 'Detailed findings from the PlantIQ image analysis.';
    if (currentSection === 'analytics') return 'Visualizing plant health trends and insights over time with PlantIQ.';
    if (currentSection === 'history') return 'Review past PlantIQ diagnoses and track treatment effectiveness.';
    return 'Detailed findings from the PlantIQ image analysis.';
  }


  return (
    <div className="space-y-8">
      <header className="pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{greeting}</h1>
        <p className="mt-1 text-md text-muted-foreground max-w-3xl">
          Your advanced AI assistant for plant disease detection and management, powered by PlantIQ.

        </p>
      </header>

      <div className="flex space-x-2 mb-6 border-b pb-3">
        <Button variant={currentSection === 'diagnosis' ? 'default' : 'ghost'} onClick={() => setCurrentSection('diagnosis')}>New Diagnosis</Button>
        <Button variant={currentSection === 'analytics' ? 'default' : 'ghost'} onClick={() => setCurrentSection('analytics')}>Analytics</Button>
        <Button variant={currentSection === 'history' ? 'default' : 'ghost'} onClick={() => setCurrentSection('history')}>History & Outcomes</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {currentSection === 'diagnosis' && (
          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Microscope className="h-6 w-6 text-primary" />
                  Upload for PlantIQ Analysis
                </CardTitle>
                <CardDescription>
                  Provide a clear image for AI analysis by PlantIQ.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadForm
                  onDetectionStart={handleDetectionStart}
                  onDetectionComplete={handleDetectionComplete}
                  onDetectionError={handleDetectionError}
                  isProcessing={isLoadingDiagnosis}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-accent" />
                  Recent PlantIQ Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No new alerts. Your plants seem to be doing well based on recent PlantIQ scans!</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className={currentSection === 'diagnosis' ? "md:col-span-2" : "md:col-span-3"}>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {renderSectionTitleIcon()}
                {renderSectionTitle()}
              </CardTitle>
              <CardDescription>
                {renderSectionDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoadingDiagnosis && currentSection === 'diagnosis' && (
                <div className="space-y-4 p-4">
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-1/2" />
                  <p className="text-center text-primary font-semibold pt-4">PlantIQ AI is analyzing your plant...</p>
                </div>
              )}
              {error && ( 
                <Alert variant="destructive" className="m-4">
                  <ShieldAlert className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!isLoadingDiagnosis && !error && results && currentSection === 'diagnosis' && (
                <DiseaseResults diagnoses={results.diagnoses} uploadedImage={uploadedImagePreview} />
              )}
              {!isLoadingDiagnosis && !error && !results && currentSection === 'diagnosis' && (
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                  <HelpCircle className="h-16 w-16 mb-4 opacity-70" />
                  <p className="text-lg">Your plant's health report by PlantIQ will appear here.</p>
                  <p className="text-sm">Upload an image to begin diagnosis.</p>
                </div>
              )}
              {currentSection === 'analytics' && !error && (
                 <AnalyticsDashboard summary={analyticsSummary} isLoading={isLoadingAnalytics} />
              )}
              {currentSection === 'history' && !error && (
                <DiagnosisHistoryList history={diagnosisHistory} isLoading={isLoadingHistory} />
              )}
            </CardContent>
            {results && currentSection === 'diagnosis' && (
              <CardFooter className="border-t pt-4">
                 <p className="text-xs text-muted-foreground">
                    Disclaimer: PlantIQ AI analysis provides suggestions and is not a substitute for professional advice.
                 </p>
              </CardFooter>
            )}
             {(currentSection === 'analytics' || currentSection === 'history') && !error &&(
                <CardFooter className="border-t pt-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3"/>
                        {currentSection === 'history' ? 'PlantIQ diagnosis history is currently session-based. ' : 'PlantIQ analytics are based on session data. '}
                        Configure Firebase for persistent storage.
                    </p>
                </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
