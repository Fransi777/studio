
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiagnosisRecord } from "@/types";
import { CalendarDays, Leaf, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface DiagnosisHistoryItemProps {
  record: DiagnosisRecord | null;
  isLoading: boolean;
}

export function DiagnosisHistoryItem({ record, isLoading }: DiagnosisHistoryItemProps) {
  if (isLoading || !record) {
    return (
      <Card className="shadow-sm animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="w-full sm:w-32 h-32 rounded-md" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-4 w-1/4"/>
        </CardFooter>
      </Card>
    );
  }

  const mainDiagnosis = record.diagnoses && record.diagnoses.length > 0 ? record.diagnoses[0] : null;
  const isHealthy = !mainDiagnosis;
  
  let displayDate = "Date N/A";
  try {
    displayDate = format(new Date(record.timestamp), "PPpp 'UTC'");
  } catch (e) {
    console.warn("Error formatting date:", record.timestamp, e);
    // displayDate remains "Date N/A" or you could try a simpler format
    try {
        displayDate = new Date(record.timestamp).toLocaleDateString();
    } catch (e2) {
        // fallback if even basic toLocaleDateString fails
    }
  }


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg flex items-center gap-2">
                {isHealthy ? <CheckCircle className="text-green-500 h-5 w-5" /> : <Leaf className="text-primary h-5 w-5" />}
                {isHealthy ? "Plant Healthy" : mainDiagnosis?.disease || "Analysis Result"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                    <CalendarDays className="h-3 w-3" /> {displayDate}
                </CardDescription>
            </div>
            {mainDiagnosis && (
                 <Badge variant={mainDiagnosis.confidence > 0.7 ? "destructive" : mainDiagnosis.confidence > 0.5 ? "default" : "secondary"}>
                    {mainDiagnosis.confidence > 0.7 ? <AlertCircle className="mr-1 h-3 w-3"/> : mainDiagnosis.confidence > 0.5 ? <Sparkles className="mr-1 h-3 w-3"/>: null}
                    {(mainDiagnosis.confidence * 100).toFixed(0)}% Conf.
                 </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 items-start">
        {record.photoDataUri && (
          <div className="relative w-full sm:w-32 h-32 rounded-md overflow-hidden border flex-shrink-0">
            <Image src={record.photoDataUri} alt={`Plant scan from ${displayDate}`} layout="fill" objectFit="cover" data-ai-hint="plant scan history"/>
          </div>
        )}
        <div className="flex-grow">
          {isHealthy ? (
            <p className="text-sm text-muted-foreground">No significant diseases detected in this scan.</p>
          ) : (
            <>
              {mainDiagnosis?.treatmentSuggestions && mainDiagnosis.treatmentSuggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Top Suggestion:</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mainDiagnosis.treatmentSuggestions[0]}</p>
                </div>
              )}
              {record.diagnoses && record.diagnoses.length > 1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{record.diagnoses.length - 1} other potential observation(s).
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
      {/* Optional: Add a footer for actions like "View Full Report" */}
      {/* <CardFooter>
        <Button variant="link" size="sm" className="p-0 h-auto">View Full Report</Button>
      </CardFooter> */}
    </Card>
  );
}
