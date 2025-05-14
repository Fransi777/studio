'use client';

import { useState, useEffect } from 'react';
import { ImageUploadForm } from '@/components/ImageUploadForm';
import { DiseaseResults } from '@/components/DiseaseResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import { ShieldAlert, CheckCircle2, Microscope, HelpCircle, LineChart, CalendarDays, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerdantVisionDashboardPage() {
  const [results, setResults] = useState<DetectDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'diagnosis' | 'analytics' | 'history'>('diagnosis');

  const handleDetectionStart = () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setUploadedImagePreview(null); 
  };

  const handleDetectionComplete = (data: DetectDiseaseOutput, imagePreviewUrl: string) => {
    setResults(data);
    setUploadedImagePreview(imagePreviewUrl);
    setIsLoading(false);
    setError(null);
    setCurrentSection('diagnosis'); // Switch to diagnosis view
  };

  const handleDetectionError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setResults(null);
    setUploadedImagePreview(null);
  };

  // Placeholder for real-time data effect
  const [greeting, setGreeting] = useState("Welcome to Verdant Vision");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning! Ready to check your plants?");
    else if (hour < 18) setGreeting("Good Afternoon! Let's analyze your plant's health.");
    else setGreeting("Good Evening! Upload a plant image to get started.");
  }, []);


  return (
    <div className="space-y-8">
      <header className="pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{greeting}</h1>
        <p className="mt-1 text-md text-muted-foreground max-w-3xl">
          Your advanced AI assistant for plant disease detection and management.
        </p>
      </header>

      {/* Navigation (Simplified Tab-like buttons) */}
      {/* <div className="flex space-x-2 mb-6 border-b pb-2">
        <Button variant={currentSection === 'diagnosis' ? 'default' : 'ghost'} onClick={() => setCurrentSection('diagnosis')}>New Diagnosis</Button>
        <Button variant={currentSection === 'analytics' ? 'default' : 'ghost'} onClick={() => setCurrentSection('analytics')}>Analytics</Button>
        <Button variant={currentSection === 'history' ? 'default' : 'ghost'} onClick={() => setCurrentSection('history')}>History</Button>
      </div> */}
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Upload and Actions */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Microscope className="h-6 w-6 text-primary" />
                Upload Plant Image
              </CardTitle>
              <CardDescription>
                Provide a clear image for AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadForm
                onDetectionStart={handleDetectionStart}
                onDetectionComplete={handleDetectionComplete}
                onDetectionError={handleDetectionError}
                isProcessing={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-accent" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No new alerts. Your plants seem to be doing well based on recent scans!</p>
              {/* Placeholder for actual alerts */}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analysis Report / Other sections */}
        <div className="md:col-span-2">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {isLoading ? <ShieldAlert className="h-6 w-6 text-primary animate-pulse" /> : results ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <LineChart className="h-6 w-6 text-primary" />}
                {currentSection === 'diagnosis' ? 'Analysis Report' : currentSection === 'analytics' ? 'Health Analytics' : 'Diagnosis History'}
              </CardTitle>
              <CardDescription>
                {currentSection === 'diagnosis' ? 'Detailed findings from the image analysis.' : 'Insights and trends over time.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="space-y-4 p-4">
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-1/2" />
                  <p className="text-center text-primary font-semibold pt-4">Verdant Vision AI is analyzing your plant...</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive" className="m-4">
                  <ShieldAlert className="h-5 w-5" />
                  <AlertTitle>Analysis Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!isLoading && !error && results && currentSection === 'diagnosis' && (
                <DiseaseResults diagnoses={results.diagnoses} uploadedImage={uploadedImagePreview} />
              )}
              {!isLoading && !error && !results && currentSection === 'diagnosis' && (
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                  <HelpCircle className="h-16 w-16 mb-4 opacity-70" />
                  <p className="text-lg">Your plant's health report will appear here.</p>
                  <p className="text-sm">Upload an image to begin.</p>
                </div>
              )}
              {currentSection === 'analytics' && (
                 <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                  <LineChart className="h-16 w-16 mb-4 opacity-70" />
                  <p className="text-lg">Historical Analytics</p>
                  <p className="text-sm">Trends and insights from past diagnoses will be shown here. (Feature coming soon)</p>
                  <Skeleton className="w-full h-48 mt-4 rounded-lg" />
                </div>
              )}
              {currentSection === 'history' && (
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                  <CalendarDays className="h-16 w-16 mb-4 opacity-70" />
                  <p className="text-lg">Diagnosis History</p>
                  <p className="text-sm">A log of your past plant health analyses will be available here. (Feature coming soon)</p>
                </div>
              )}
            </CardContent>
            {results && currentSection === 'diagnosis' && (
              <CardFooter className="border-t pt-4">
                 <p className="text-xs text-muted-foreground">
                    Disclaimer: AI analysis provides suggestions and is not a substitute for professional advice.
                 </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Placeholder for future sections like "Treatment Outcomes" or "Resource Library" */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader><CardTitle>Treatment Efficacy Tracker</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Track how treatments are working. (Coming Soon)</p></CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader><CardTitle>Expanded Knowledge Base</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Access detailed articles and guides. (Coming Soon)</p></CardContent>
          </Card>
      </div> */}
    </div>
  );
}
