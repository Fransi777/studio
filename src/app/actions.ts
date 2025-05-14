// src/app/actions.ts
"use server";

import { detectDisease, type DetectDiseaseInput, type DetectDiseaseOutput } from "@/ai/flows/detect-disease";

export async function performDiseaseDetection(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  try {
    const result = await detectDisease(input);
    // Add a small delay to simulate network latency for better UX perception
    await new Promise(resolve => setTimeout(resolve, 500));
    return result;
  } catch (error) {
    console.error("Error in performDiseaseDetection:", error);
    // It's better to throw a custom error or a more specific error object
    // For now, rethrowing the original error or a generic one.
    if (error instanceof Error) {
      throw new Error(`Failed to detect disease: ${error.message}`);
    }
    throw new Error("An unknown error occurred during disease detection.");
  }
}
