import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen } from "lucide-react";

interface ResourceLinksProps {
  diseaseName: string;
}

export function ResourceLinks({ diseaseName }: ResourceLinksProps) {
  if (!diseaseName) {
    return null;
  }

  return (
    <div className="space-y-3">
        <div>
            <h4 className="font-semibold text-md mb-2 flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-primary" /> Learn More:
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
                Find comprehensive information, alternative treatment options, and preventive measures for {diseaseName.toLowerCase()} from trusted sources.
            </p>
            <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
            <a
                href={`https://www.google.com/search?q=plant+disease+${encodeURIComponent(diseaseName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
            >
                Search on Google <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            </Button>
        </div>
    </div>
  );
}
