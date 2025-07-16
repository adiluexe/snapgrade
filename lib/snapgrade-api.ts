// SnapGrade Frontend - Backend Integration
// This file provides utilities to connect your Next.js app to the Python OpenCV backend

export interface ProcessingResult {
  success: boolean;
  student_answers: string[];
  correct_answers: string[];
  score: number;
  total_questions: number;
  percentage: number;
  incorrect_questions: number[];
  processing_time: number;
  confidence_scores: number[];
  image_quality: ImageQuality;
  student_id?: string;
}

export interface ImageQuality {
  resolution: string;
  lighting: string;
  skew_angle: number;
  blur_score: number;
}

export interface BubbleSheetTemplate {
  id: string;
  name: string;
  questions: number;
  choices: string[];
  description: string;
}

// Configuration
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export class SnapGradeAPI {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the backend is healthy and running
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error("Backend health check failed:", error);
      return false;
    }
  }

  /**
   * Get available bubble sheet templates
   */
  async getTemplates(): Promise<BubbleSheetTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`);
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }
      const data = await response.json();
      return data.templates;
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      throw error;
    }
  }

  /**
   * Process a bubble sheet image
   */
  async processImage(
    imageFile: File,
    answerKey: string[],
    templateId: string = "standard_25",
    studentId?: string
  ): Promise<ProcessingResult> {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("answer_key", JSON.stringify(answerKey));
      formData.append("template_id", templateId);
      if (studentId) {
        formData.append("student_id", studentId);
      }

      const response = await fetch(`${this.baseUrl}/process-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Processing failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Image processing failed:", error);
      throw error;
    }
  }

  /**
   * Process demo image (for testing)
   */
  async processDemoImage(): Promise<ProcessingResult> {
    try {
      const response = await fetch(`${this.baseUrl}/process-demo`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Demo processing failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Demo processing failed:", error);
      throw error;
    }
  }

  /**
   * Upload image via webcam capture
   */
  async processWebcamImage(
    imageBlob: Blob,
    answerKey: string[],
    templateId: string = "standard_25",
    studentId?: string
  ): Promise<ProcessingResult> {
    // Convert blob to file
    const file = new File([imageBlob], "webcam-capture.jpg", {
      type: "image/jpeg",
    });
    return this.processImage(file, answerKey, templateId, studentId);
  }
}

// Utility functions for image handling
export const ImageUtils = {
  /**
   * Validate image file before upload (basic checks)
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "File must be an image" };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: "Image file too large (max 10MB)" };
    }

    return { valid: true };
  },

  /**
   * Validate image dimensions (async)
   */
  validateImageDimensions(
    file: File
  ): Promise<{ valid: boolean; error?: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 300 || img.height < 400) {
          resolve({
            valid: false,
            error: "Image resolution too low (minimum 300x400)",
          });
        } else if (img.width > 4000 || img.height > 6000) {
          resolve({
            valid: false,
            error: "Image resolution too high (maximum 4000x6000)",
          });
        } else {
          resolve({ valid: true });
        }
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve({ valid: false, error: "Invalid image file" });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Convert file to base64 for preview
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Capture image from webcam
   */
  captureFromWebcam(video: HTMLVideoElement): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          resolve(blob!);
        },
        "image/jpeg",
        0.9
      );
    });
  },
};

// Export singleton instance
export const snapGradeAPI = new SnapGradeAPI();

// React hooks for easy integration
export function useSnapGradeAPI() {
  return snapGradeAPI;
}

// Example usage in a React component:
/*
import { useSnapGradeAPI, ImageUtils } from '@/lib/snapgrade-api';

function BubbleSheetUploader() {
  const api = useSnapGradeAPI();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const validation = await ImageUtils.validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const answerKey = ['A', 'B', 'C', 'D']; // Your answer key
      const result = await api.processImage(file, answerKey);
      setResult(result);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />
      {isProcessing && <p>Processing...</p>}
      {result && (
        <div>
          <h3>Results</h3>
          <p>Score: {result.score}/{result.total_questions} ({result.percentage}%)</p>
        </div>
      )}
    </div>
  );
}
*/
