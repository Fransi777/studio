
"use client";

import type { DiagnosisRecord } from "@/types";
import { DiagnosisHistoryItem } from "./DiagnosisHistoryItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Archive } from "lucide-react";

interface DiagnosisHistoryListProps {
  history: DiagnosisRecord[];
  isLoading: boolean;
}

export function DiagnosisHistoryList({ history, isLoading }: DiagnosisHistoryListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading History...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <DiagnosisHistoryItem key={i} record={null} isLoading={true} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
        <Archive className="h-16 w-16 mb-4 opacity-70" />
        <p className="text-lg">No Diagnosis History Found</p>
        <p className="text-sm">Perform a plant analysis to see your history here.</p>
        <p className="text-xs mt-2">(Note: History is currently session-based. Setup Firebase for persistence.)</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4"> 
      <div className="space-y-4">
        {history.map((record) => (
          <DiagnosisHistoryItem key={record.id} record={record} isLoading={false} />
        ))}
      </div>
    </ScrollArea>
  );
}
