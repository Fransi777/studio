
import type { DetectDiseaseOutput } from "@/ai/flows/detect-disease";

export interface DiagnosisRecord extends DetectDiseaseOutput {
  id: string; // Unique ID for the record
  photoDataUri?: string; // Optional: if you want to store the preview
  timestamp: string; // ISO string date
  userId?: string; // Optional: for multi-user systems
}

export interface AnalyticsSummary {
  totalScans: number;
  healthyScans: number;
  diseasedScans: number;
  commonIssues: { name: string; count: number }[];
}
