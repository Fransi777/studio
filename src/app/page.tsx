'use client';

import { useState } from 'react';
import { ImageUploadForm } from '@/components/ImageUploadForm';
import { DiseaseResults } from '@/components/DiseaseResults';
import { ResourceLinks } from '@/components/ResourceLinks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import { ShieldAlert, CheckCircle2, Microscope, HelpCircle } from 'lucide-react';

export default function VerdantVisionPage() {
  const [results, setResults] = useState<DetectDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

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
  };

  const handleDetectionError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setResults(null);
    setUploadedImagePreview(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image of your plant, and our AI will help identify potential diseases, offering insights and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Microscope className="h-6 w-6 text-primary" />
              Start Diagnosis
            </CardTitle>
            <CardDescription>
              Select or drag & drop an image of the affected plant. Clear, well-lit photos provide the best results.
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

        <Card className="shadow-xl min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              {isLoading ? <ShieldAlert className="h-6 w-6 text-primary animate-pulse" /> : <CheckCircle2 className="h-6 w-6 text-primary" />}
              Analysis Report
            </CardTitle>
            <CardDescription>
              Potential diseases and their confidence levels will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <p className="text-center text-primary font-medium">Analyzing your plant, please wait...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Detection Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && results && (
              <DiseaseResults diagnoses={results.diagnoses} uploadedImage={uploadedImagePreview} />
            )}
            {!isLoading && !error && !results && (
              <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                <HelpCircle className="h-12 w-12 mb-4" />
                <p>Your plant's health report will be shown here once an image is analyzed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!isLoading && results && results.diagnoses.length > 0 && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Further Information & Resources</CardTitle>
            <CardDescription>
              Explore these resources to learn more about the identified conditions and potential treatments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceLinks diagnoses={results.diagnoses} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
