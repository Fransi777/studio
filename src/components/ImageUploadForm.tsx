"use client";

import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performDiseaseDetection } from "@/app/actions";
import type { DetectDiseaseOutput } from "@/ai/flows/detect-disease";

interface ImageUploadFormProps {
  onDetectionStart: () => void;
  onDetectionComplete: (data: DetectDiseaseOutput, imagePreviewUrl: string) => void;
  onDetectionError: (message: string) => void;
  isProcessing: boolean;
}

export function ImageUploadForm({
  onDetectionStart,
  onDetectionComplete,
  onDetectionError,
  isProcessing,
}: ImageUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup preview URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError("File size exceeds 5MB. Please choose a smaller image.");
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        event.target.value = ""; // Reset file input
        return;
      }
      if (!file.type.startsWith("image/")) {
        setUploadError("Invalid file type. Please select an image (JPEG, PNG, GIF, WEBP).");
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        event.target.value = ""; // Reset file input
        return;
      }
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select an image file.");
      return;
    }

    onDetectionStart();
    setUploadError(null);

    try {
      const photoDataUri = await fileToDataUri(selectedFile);
      const result = await performDiseaseDetection({ photoDataUri });
      
      if (previewUrl) { // Ensure previewUrl is set
         onDetectionComplete(result, previewUrl);
         toast({
          title: "Analysis Complete",
          description: "Plant disease detection finished successfully.",
        });
      } else {
        // This case should ideally not happen if a file is selected
        throw new Error("Image preview was not available.");
      }
     
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      onDetectionError(errorMessage);
      toast({
        variant: "destructive",
        title: "Detection Failed",
        description: errorMessage,
      });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadError(null);
    const fileInput = document.getElementById('plant-image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="plant-image-upload" className="block text-sm font-medium text-foreground mb-1">
          Plant Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="flex text-sm text-muted-foreground">
              <label
                htmlFor="plant-image-upload"
                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
              >
                <span>Upload a file</span>
                <Input
                  id="plant-image-upload"
                  name="plant-image-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  disabled={isProcessing}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 5MB</p>
          </div>
        </div>
      </div>

      {uploadError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {previewUrl && selectedFile && (
        <div className="mt-4 p-4 border rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-foreground mb-2">Image Preview:</h3>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image src={previewUrl} alt="Preview of uploaded plant" layout="fill" objectFit="contain" data-ai-hint="plant leaf" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Filename: {selectedFile.name}</p>
          <Button type="button" variant="outline" size="sm" onClick={clearSelection} className="mt-2 text-destructive hover:text-destructive/80" disabled={isProcessing}>
            <XCircle className="mr-2 h-4 w-4" /> Clear Selection
          </Button>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!selectedFile || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Detect Diseases"
        )}
      </Button>
    </form>
  );
}
