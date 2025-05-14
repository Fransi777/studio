"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, XCircle, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performDiseaseDetection } from "@/app/actions";
import type { DetectDiseaseOutput } from "@/ai/flows/detect-disease";
import { cn } from "@/lib/utils";

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
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = useCallback((file: File | null) => {
    if (!file) {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError("File size exceeds 5MB. Please choose a smaller image.");
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      const fileInput = document.getElementById('plant-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Invalid file type. Please select an image (JPEG, PNG, GIF, WEBP).");
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      const fileInput = document.getElementById('plant-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      return;
    }
    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
  }, [previewUrl]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file || null);
  };
  
  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Optional: Add visual feedback for drag over
  };
  
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file || null);
     const fileInput = document.getElementById('plant-image-upload') as HTMLInputElement;
    if (fileInput && event.dataTransfer.files) {
      fileInput.files = event.dataTransfer.files;
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
      
      if (previewUrl) {
         onDetectionComplete(result, previewUrl);
         toast({
          title: "Analysis Complete",
          description: "Plant health report is ready.",
          variant: 'default', // Explicitly default or use custom variant
        });
      } else {
        throw new Error("Image preview was not available.");
      }
     
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      onDetectionError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
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
        <label htmlFor="plant-image-upload" className="sr-only">
          Plant Image Upload
        </label>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors",
            isDragging ? "border-primary bg-primary/10" : "border-input hover:border-primary/70",
            isProcessing ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          )}
          onClick={() => !isProcessing && document.getElementById('plant-image-upload')?.click()}
        >
          <div className="space-y-2 text-center">
            {previewUrl && selectedFile ? (
              <div className="relative w-32 h-32 mx-auto rounded-md overflow-hidden border shadow-sm">
                 <Image src={previewUrl} alt="Preview of uploaded plant" layout="fill" objectFit="cover" data-ai-hint="plant leaf" />
              </div>
            ) : (
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            )}
            <div className="flex text-sm text-muted-foreground">
              <span
                className="relative font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
              >
                <span>{selectedFile ? "Change file" : "Upload a file"}</span>
                <Input
                  id="plant-image-upload"
                  name="plant-image-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  disabled={isProcessing}
                />
              </span>
              {!selectedFile && <p className="pl-1">or drag and drop</p>}
            </div>
            {selectedFile ? (
                 <p className="text-xs text-muted-foreground truncate max-w-xs">{selectedFile.name}</p>
            ) : (
                 <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 5MB</p>
            )}
          </div>
        </div>
      </div>

      {uploadError && (
        <Alert variant="destructive" className="shadow-sm">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {selectedFile && !isProcessing && (
        <Button type="button" variant="outline" size="sm" onClick={clearSelection} className="w-full text-destructive hover:text-destructive/80 border-destructive/50 hover:border-destructive">
            <XCircle className="mr-2 h-4 w-4" /> Clear Selection
        </Button>
      )}

      <Button type="submit" className="w-full text-base py-3 h-auto" disabled={!selectedFile || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Plant...
          </>
        ) : (
          <>
            <FileImage className="mr-2 h-5 w-5" />
            Start AI Diagnosis
          </>
        )}
      </Button>
    </form>
  );
}
