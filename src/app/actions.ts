// src/app/actions.ts
"use server";

import { detectDisease, type DetectDiseaseInput, type DetectDiseaseOutput } from "@/ai/flows/detect-disease";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second

export async function performDiseaseDetection(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const result = await detectDisease(input);
      // Add a small delay to simulate network latency for better UX perception,
      // but only on successful attempt or if not retrying.
      if (attempts === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return result;
    } catch (error) {
      attempts++;
      console.error(`Error in performDiseaseDetection (attempt ${attempts}/${MAX_RETRIES}):`, error);

      if (error instanceof Error && error.message.includes("503 Service Unavailable")) {
        if (attempts < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempts)); // Exponential backoff could also be used
          continue; // Retry
        } else {
          // Max retries reached for 503 error
          throw new Error("The Plant Analysis Service is currently busy. Please try again in a few moments.");
        }
      }
      
      // For other errors or if max retries reached for non-503 errors
      if (error instanceof Error) {
        throw new Error(`Failed to detect disease: ${error.message}`);
      }
      throw new Error("An unknown error occurred during disease detection.");
    }
  }
  // This part should ideally not be reached if logic is correct,
  // but as a fallback:
  throw new Error("Failed to detect disease after multiple attempts.");
}
