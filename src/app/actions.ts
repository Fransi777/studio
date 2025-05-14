
// src/app/actions.ts
"use server";

import { detectDisease, type DetectDiseaseInput, type DetectDiseaseOutput } from "@/ai/flows/detect-disease";
import type { DiagnosisRecord, AnalyticsSummary } from "@/types";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second

// --- Simulating Firestore Database ---
// In a real application, this would be your Firestore instance and collections.
// User needs to set up Firebase and replace these simulated functions.
let simulatedHistoryDB: DiagnosisRecord[] = [];
// --- End Simulation ---

export async function performDiseaseDetectionAndSave(input: DetectDiseaseInput, imagePreviewUrl: string): Promise<DetectDiseaseOutput> {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const result = await detectDisease(input);
      
      // --- Save to Firestore (Simulated) ---
      // Replace this with actual Firestore save logic
      const newRecord: DiagnosisRecord = {
        ...result,
        id: Date.now().toString() + Math.random().toString(36).substring(2,7), // Simple unique ID
        photoDataUri: imagePreviewUrl, // Storing the preview URL
        timestamp: new Date().toISOString(),
        // userId: 'current_user_id' // TODO: Implement user authentication
      };
      simulatedHistoryDB.unshift(newRecord); // Add to the beginning of the array
      console.log("Diagnosis saved (simulated):", newRecord.id);
      // --- End Save ---

      if (attempts === 0 && (!result.diagnoses || result.diagnoses.length > 0)) {
        await new Promise(resolve => setTimeout(resolve, 700));
      }
      return result;
    } catch (error) {
      attempts++;
      console.error(`Error in performDiseaseDetectionAndSave (attempt ${attempts}/${MAX_RETRIES}):`, error);

      if (error instanceof Error && error.message.includes("503 Service Unavailable")) {
        if (attempts < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempts)); 
          continue; 
        } else {
          throw new Error("The Plant Analysis Service is currently busy. Please try again in a few moments.");
        }
      }
      
      if (error instanceof Error) {
        if (error.message.includes("SAFETY")) {
          throw new Error("The analysis could not be completed due to content safety filters. Try a different image or adjust your plant description.");
        }
        if (error.message.includes("Invalid media")) {
          throw new Error("The uploaded image could not be processed. Please try a different image format or a clearer picture.");
        }
        throw new Error(`Failed to detect disease: ${error.message}`);
      }
      throw new Error("An unknown error occurred during disease detection.");
    }
  }
  throw new Error("Failed to detect disease after multiple attempts.");
}


export async function getDiagnosisHistory(): Promise<DiagnosisRecord[]> {
  // --- Fetch from Firestore (Simulated) ---
  // Replace this with actual Firestore fetch logic, e.g., querying a collection
  // ordered by timestamp descending.
  console.log("Fetching diagnosis history (simulated), count:", simulatedHistoryDB.length);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(JSON.parse(JSON.stringify(simulatedHistoryDB))); // Return a copy
  // --- End Fetch ---
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  // --- Fetch and process from Firestore (Simulated) ---
  // In a real app, you might do this with Firestore aggregation or server-side processing.
  const history = await getDiagnosisHistory(); // Using the simulated fetch

  const totalScans = history.length;
  let healthyScans = 0;
  const diseaseCounts: Record<string, number> = {};

  history.forEach(record => {
    if (!record.diagnoses || record.diagnoses.length === 0) {
      healthyScans++;
    } else {
      record.diagnoses.forEach(diag => {
        diseaseCounts[diag.disease] = (diseaseCounts[diag.disease] || 0) + 1;
      });
    }
  });

  const commonIssues = Object.entries(diseaseCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3) // Top 3
    .map(([name, count]) => ({ name, count }));
  
  const summary: AnalyticsSummary = {
    totalScans,
    healthyScans,
    diseasedScans: totalScans - healthyScans,
    commonIssues,
  };
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log("Fetching analytics summary (simulated):", summary);
  return Promise.resolve(summary);
  // --- End Fetch & Process ---
}
