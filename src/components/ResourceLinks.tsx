import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DetectDiseaseOutput } from '@/ai/flows/detect-disease';
import { ExternalLink, BookOpen } from "lucide-react";

interface ResourceLinksProps {
  diagnoses: DetectDiseaseOutput['diagnoses'];
}

export function ResourceLinks({ diagnoses }: ResourceLinksProps) {
  if (!diagnoses || diagnoses.length === 0) {
    return null;
  }

  const uniqueDiseases = Array.from(new Set(diagnoses.map(d => d.disease)));

  return (
    <div className="space-y-4">
      {uniqueDiseases.map((disease, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Learn more about: {disease}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Find comprehensive information, treatment options, and preventive measures for {disease.toLowerCase()}.
            </p>
            <Button asChild variant="outline">
              <a
                href={`https://www.google.com/search?q=plant+disease+${encodeURIComponent(disease)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Search on Google <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
