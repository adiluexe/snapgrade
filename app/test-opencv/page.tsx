"use client";

import React, { useState, useRef } from "react";
import {
  useSnapGradeAPI,
  ImageUtils,
  ProcessingResult,
  BubbleSheetTemplate,
} from "@/lib/snapgrade-api";
import { downloadBubbleSheetPDF } from "@/lib/bubblesheet";
import {
  Upload,
  Camera,
  Download,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

export default function TestBubbleSheet() {
  const api = useSnapGradeAPI();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [templates, setTemplates] = useState<BubbleSheetTemplate[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5-question test answer key (you can modify this)
  const answerKey = ["A", "B", "C", "D", "A"];
  const testTitle = "Sample 5-Question Test";

  // Check backend status on component mount
  React.useEffect(() => {
    checkBackendStatus();
    loadTemplates();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const healthy = await api.healthCheck();
      setBackendOnline(healthy);
    } catch (error) {
      setBackendOnline(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const templateList = await api.getTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    // Validate file
    const validation = ImageUtils.validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    // Additional dimension validation
    try {
      const dimensionValidation = await ImageUtils.validateImageDimensions(
        file
      );
      if (!dimensionValidation.valid) {
        setError(dimensionValidation.error || "Invalid image dimensions");
        return;
      }
    } catch (error) {
      setError("Failed to validate image");
      return;
    }

    setSelectedFile(file);

    // Create preview
    try {
      const preview = await ImageUtils.fileToBase64(file);
      setPreviewUrl(preview);
    } catch (error) {
      console.error("Failed to create preview:", error);
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await api.processImage(
        selectedFile,
        answerKey,
        "simple_5", // Using the optimized 5-question template
        `student-${Date.now()}`
      );

      setResult(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to process image"
      );
    } finally {
      setProcessing(false);
    }
  };

  const processDemo = async () => {
    setProcessing(true);
    setError(null);

    try {
      const result = await api.processDemoImage();
      setResult(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to process demo"
      );
    } finally {
      setProcessing(false);
    }
  };

  const downloadTemplate = () => {
    downloadBubbleSheetPDF(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              SnapGrade OpenCV Test
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Test your OpenCV backend with a 5-question bubble sheet
          </p>

          {/* Backend Status */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {backendOnline === null ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking backend...</span>
              </div>
            ) : backendOnline ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Backend Online (OpenCV Ready)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Backend Offline - Start with: python main.py</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Process */}
          <div className="space-y-6">
            {/* Download Template */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-indigo-600" />
                Step 1: Download Template
              </h2>
              <p className="text-gray-600 mb-4">
                Download a 5-question bubble sheet template, fill it out, and
                scan it back.
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-indigo-800 font-medium">
                  Answer Key:
                </p>
                <div className="flex gap-2 mt-2">
                  {answerKey.map((answer, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-200 text-indigo-800 rounded text-sm font-mono"
                    >
                      {index + 1}: {answer}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download 5-Question Template
              </button>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-600" />
                Step 2: Upload Filled Sheet
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Choose an image of your filled bubble sheet
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={!backendOnline}
                >
                  Choose Image
                </button>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FileText className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <button
                    onClick={processImage}
                    disabled={processing || !backendOnline}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing with OpenCV...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Process with OpenCV
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Demo Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Step 3: Try Demo (Optional)
              </h2>
              <p className="text-gray-600 mb-4">
                Test the backend with simulated data to see how results look.
              </p>
              <button
                onClick={processDemo}
                disabled={processing || !backendOnline}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running Demo...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    Run Demo Test
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Preview & Results */}
          <div className="space-y-6">
            {/* Image Preview */}
            {previewUrl && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  Image Preview
                </h3>
                <img
                  src={previewUrl}
                  alt="Bubble sheet preview"
                  className="w-full h-64 object-contain border border-gray-200 rounded-lg"
                />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Error</h3>
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Processing Results
                </h3>

                {/* Score Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {result.score}/{result.total_questions}
                    </div>
                    <div className="text-sm text-green-600">Score</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {result.percentage}%
                    </div>
                    <div className="text-sm text-blue-600">Percentage</div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Student Answers:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {result.student_answers.map((answer, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-sm font-mono ${
                            answer === result.correct_answers[index]
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {index + 1}: {answer || "—"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Correct Answers:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {result.correct_answers.map((answer, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono"
                        >
                          {index + 1}: {answer}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Processing Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Processed in {result.processing_time}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        Quality: {result.image_quality?.resolution || "Good"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backend Info */}
            {templates.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Templates
                </h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{template.name}</span>
                      <span className="text-sm text-gray-600">
                        {template.questions} questions
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
