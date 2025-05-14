"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import { Smile, Frown, Info, Leaf, ShieldCheck, ShieldAlert, Sparkles, MessageSquareWarning, Bot } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResourceLinks } from './ResourceLinks'; // Assuming ResourceLinks is updated or still relevant
import { cn } from "@/lib/utils";

interface DiseaseResultsProps {
  diagnoses: DetectDiseaseOutput['diagnoses'];
  uploadedImage: string | null;
}

export function DiseaseResults({ diagnoses, uploadedImage }: DiseaseResultsProps) {
  if (!diagnoses || diagnoses.length === 0) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700/50">
        <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-300">Plant Appears Healthy</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          The AI analysis did not identify any significant diseases from the provided image, or the plant appears to be in good health. Continue good care practices!
        </AlertDescription>
      </Alert>
    );
  }

  const getConfidenceColor = (confidence: number): string => {
    if (confidence > 0.75) return "hsl(var(--destructive))"; // Red
    if (confidence > 0.5) return "hsl(var(--accent))"; // Orange/Yellow (Accent)
    return "hsl(var(--primary))"; // Green
  };
  
  const getConfidenceIcon = (confidence: number) => {
    if (confidence > 0.75) return <ShieldAlert className="h-4 w-4 text-destructive-foreground" />;
    if (confidence > 0.5) return <MessageSquareWarning className="h-4 w-4 text-accent-foreground" />;
    return <Sparkles className="h-4 w-4 text-primary-foreground" />;
  };

  const getConfidenceBadgeVariant = (confidence: number): "destructive" | "default" | "secondary" => {
     if (confidence > 0.75) return "destructive";
     if (confidence > 0.5) return "default"; // Default will use accent color for this badge
     return "secondary";
  }

  return (
    <div className="space-y-6">
      {uploadedImage && (
        <Card className="overflow-hidden shadow-lg rounded-xl border-border/70">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">Uploaded Plant Image</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full aspect-[16/10] rounded-b-xl overflow-hidden">
              <Image src={uploadedImage} alt="Uploaded plant for diagnosis" layout="fill" objectFit="contain" data-ai-hint="plant analysis" />
            </div>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible defaultValue={`item-${diagnoses[0]?.disease}-0`} className="w-full">
        {diagnoses.map((diagnosis, index) => (
          <AccordionItem value={`item-${diagnosis.disease}-${index}`} key={index} className="border-b-0 mb-4">
             <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
                <AccordionTrigger className="p-0 hover:no-underline focus:no-underline">
                  <CardHeader className="flex flex-row items-center justify-between w-full py-4 px-6 cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                    <div>
                      <CardTitle className="text-xl text-primary flex items-center gap-2">
                        <Leaf className="h-5 w-5" /> {diagnosis.disease}
                      </CardTitle>
                      <CardDescription>Confidence: {(diagnosis.confidence * 100).toFixed(0)}%</CardDescription>
                    </div>
                    <Badge 
                        variant={getConfidenceBadgeVariant(diagnosis.confidence)} 
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold",
                            diagnosis.confidence <= 0.5 && "bg-secondary text-secondary-foreground",
                            diagnosis.confidence > 0.5 && diagnosis.confidence <= 0.75 && "bg-accent text-accent-foreground"
                        )}
                    >
                      {getConfidenceIcon(diagnosis.confidence)}
                      <span>{(diagnosis.confidence * 100).toFixed(0)}% Confident</span>
                    </Badge>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="px-6 pb-6 pt-2 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Progress 
                        value={diagnosis.confidence * 100} 
                        className="w-full h-2.5"
                        indicatorClassName={cn(
                            diagnosis.confidence > 0.75 && "bg-destructive",
                            diagnosis.confidence > 0.5 && diagnosis.confidence <= 0.75 && "bg-accent",
                            diagnosis.confidence <= 0.5 && "bg-primary"
                        )}
                        aria-label={`Confidence for ${diagnosis.disease}: ${(diagnosis.confidence * 100).toFixed(0)}%`}
                      />
                    </div>

                    {diagnosis.confidence > 0.75 && (
                      <Alert variant="destructive" className="shadow-inner">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>High Confidence Identification</AlertTitle>
                        <AlertDescription>
                          This condition is identified with high confidence. Prompt attention is recommended.
                        </AlertDescription>
                      </Alert>
                    )}
                    {diagnosis.confidence <= 0.75 && diagnosis.confidence > 0.5 && (
                      <Alert variant="default" className="bg-accent/10 border-accent/50 text-accent-foreground dark:bg-accent/20 dark:border-accent/70 shadow-inner">
                        <MessageSquareWarning className="h-4 w-4 text-accent" />
                        <AlertTitle className="text-accent">Moderate Confidence</AlertTitle>
                        <AlertDescription>
                          This condition is identified with moderate confidence. Observe carefully and consider the suggestions.
                        </AlertDescription>
                      </Alert>
                    )}
                     {diagnosis.confidence <= 0.5 && (
                      <Alert variant="default" className="bg-primary/10 border-primary/50 text-primary-foreground dark:bg-primary/20 dark:border-primary/70 shadow-inner">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Lower Confidence</AlertTitle>
                        <AlertDescription>
                          This is a potential observation with lower confidence. Monitor your plant and cross-reference with other resources.
                        </AlertDescription>
                      </Alert>
                    )}

                    {diagnosis.treatmentSuggestions && diagnosis.treatmentSuggestions.length > 0 && (
                      <div className="pt-2">
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2 text-foreground">
                          <Bot className="h-5 w-5 text-primary" /> AI Treatment Suggestions:
                        </h4>
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
                          {diagnosis.treatmentSuggestions.map((suggestion, i) => (
                            <li key={i} className="leading-relaxed">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                     <div className="pt-2">
                        <ResourceLinks diseaseName={diagnosis.disease} />
                     </div>
                  </CardContent>
                </AccordionContent>
              </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
