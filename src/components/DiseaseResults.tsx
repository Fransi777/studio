"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import { Smile, Frown, Info } from 'lucide-react';

interface DiseaseResultsProps {
  diagnoses: DetectDiseaseOutput['diagnoses'];
  uploadedImage: string | null;
}

export function DiseaseResults({ diagnoses, uploadedImage }: DiseaseResultsProps) {
  if (!diagnoses || diagnoses.length === 0) {
    return (
      <Alert variant="default" className="bg-secondary">
        <Info className="h-4 w-4" />
        <AlertTitle>No Diseases Detected or Low Confidence</AlertTitle>
        <AlertDescription>
          The analysis did not identify any specific diseases with high confidence from the provided image, or the plant appears healthy.
        </AlertDescription>
      </Alert>
    );
  }

  const getConfidenceBadgeVariant = (confidence: number): "default" | "secondary" | "destructive" | "outline" => {
    if (confidence > 0.75) return "destructive";
    if (confidence > 0.5) return "default"; // Using default as warning (often primary color)
    return "secondary";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence > 0.75) return <Frown className="h-4 w-4 text-destructive-foreground" />;
    if (confidence > 0.5) return <Info className="h-4 w-4 text-primary-foreground" />; // For default/primary badge
    return <Smile className="h-4 w-4 text-secondary-foreground" />; // For secondary/low confidence
  }


  return (
    <div className="space-y-6">
      {uploadedImage && (
        <Card className="overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle>Uploaded Plant Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
              <Image src={uploadedImage} alt="Uploaded plant for diagnosis" layout="fill" objectFit="contain" data-ai-hint="plant analysis" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {diagnoses.map((diagnosis, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{diagnosis.disease}</CardTitle>
              <CardDescription>Confidence: {(diagnosis.confidence * 100).toFixed(0)}%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Progress 
                  value={diagnosis.confidence * 100} 
                  className="w-full h-3 [&>div]:bg-accent" 
                  aria-label={`Confidence for ${diagnosis.disease}: ${(diagnosis.confidence * 100).toFixed(0)}%`}
                />
                <Badge variant={getConfidenceBadgeVariant(diagnosis.confidence)} className="flex items-center gap-1">
                  {getConfidenceIcon(diagnosis.confidence)}
                  <span>{(diagnosis.confidence * 100).toFixed(0)}%</span>
                </Badge>
              </div>
              {diagnosis.confidence > 0.75 && (
                <Alert variant="destructive">
                  <Frown className="h-4 w-4" />
                  <AlertTitle>High Confidence Alert</AlertTitle>
                  <AlertDescription>
                    This disease has been identified with high confidence. Consider taking action.
                  </AlertDescription>
                </Alert>
              )}
               {diagnosis.confidence <= 0.75 && diagnosis.confidence > 0.5 && (
                <Alert variant="default" className="bg-accent text-accent-foreground border-accent">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Moderate Confidence</AlertTitle>
                  <AlertDescription>
                    This disease has been identified with moderate confidence. Further observation might be needed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
