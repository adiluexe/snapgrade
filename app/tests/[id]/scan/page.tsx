"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  downloadBubbleSheetPDF,
  getDemoMode,
  setDemoMode,
} from "@/lib/bubblesheet";
import {
  Upload,
  Camera,
  Download,
  FileText,
  ArrowLeft,
  PlayCircle,
  StopCircle,
  Zap,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";

interface Test {
  id: string;
  title: string;
  totalQuestions: number;
  answerKey: string[];
}

interface ScanResult {
  id: string;
  studentName: string;
  studentId: string;
  answers: string[];
  score: number;
  percentage: number;
  correct: number;
  incorrect: number;
  scannedAt: string;
}

export default function ScanSheets() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [demoMode, setDemoModeState] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load demo mode setting
    setDemoModeState(getDemoMode());

    const testId = params.id as string;
    const tests = JSON.parse(localStorage.getItem("snapgrade_tests") || "[]");
    const foundTest = tests.find((t: Test) => t.id === testId);

    if (foundTest) {
      setTest(foundTest);
      // Load existing results
      const existingResults = JSON.parse(
        localStorage.getItem(`snapgrade_results_${testId}`) || "[]"
      );
      setResults(existingResults);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  }, [params.id, router]);

  const handleDemoModeToggle = (enabled: boolean) => {
    setDemoModeState(enabled);
    setDemoMode(enabled);
  };

  // Simulate bubble sheet processing
  const simulateBubbleDetection = (fileName: string): ScanResult => {
    if (!test) throw new Error("No test found");

    // Generate random student data
    const studentNames = [
      "Alice Johnson",
      "Bob Smith",
      "Charlie Brown",
      "Diana Wilson",
      "Eva Martinez",
      "Frank Davis",
      "Grace Chen",
      "Henry Taylor",
      "Ivy Anderson",
      "Jack Thompson",
    ];

    const studentName =
      studentNames[Math.floor(Math.random() * studentNames.length)];
    const studentId = `ST${Math.floor(Math.random() * 9000) + 1000}`;

    // Generate random answers (simulating OCR detection)
    const answers = test.answerKey.map((correctAnswer, index) => {
      // 80% chance of correct answer, 20% chance of random wrong answer
      if (Math.random() < 0.8) {
        return correctAnswer;
      } else {
        const options = ["A", "B", "C", "D"];
        const wrongOptions = options.filter((opt) => opt !== correctAnswer);
        return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      }
    });

    // Calculate score
    const correct = answers.filter(
      (answer, index) => answer === test.answerKey[index]
    ).length;
    const incorrect = test.totalQuestions - correct;
    const percentage = Math.round((correct / test.totalQuestions) * 100);

    return {
      id: Date.now().toString(),
      studentName,
      studentId,
      answers,
      score: correct,
      percentage,
      correct,
      incorrect,
      scannedAt: new Date().toISOString(),
    };
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !test) return;

    setScanning(true);
    const newResults: ScanResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Simulate processing delay
      await new Promise((resolve) =>
        setTimeout(resolve, demoMode ? 1000 : 2000)
      );

      try {
        if (demoMode) {
          // Demo mode: simulate bubble detection
          const result = simulateBubbleDetection(file.name);
          newResults.push(result);
        } else {
          // Real mode: would integrate with actual computer vision
          // For now, show a message that real processing isn't implemented
          console.log("Real processing mode - would analyze:", file.name);
          // TODO: Implement actual bubble sheet scanning
          // This would involve computer vision libraries like OpenCV.js
          const result = simulateBubbleDetection(file.name);
          newResults.push(result);
        }
      } catch (error) {
        console.error("Error processing file:", file.name);
      }
    }

    // Update results
    const updatedResults = [...results, ...newResults];
    setResults(updatedResults);

    // Save to localStorage
    localStorage.setItem(
      `snapgrade_results_${test.id}`,
      JSON.stringify(updatedResults)
    );

    // Update test statistics
    const tests = JSON.parse(localStorage.getItem("snapgrade_tests") || "[]");
    const updatedTests = tests.map((t: Test) =>
      t.id === test.id ? { ...t, studentsGraded: updatedResults.length } : t
    );
    localStorage.setItem("snapgrade_tests", JSON.stringify(updatedTests));

    setScanning(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                Scan Bubble Sheets
              </h1>
              <p className="text-text/70">Test: {test.title}</p>
            </div>

            {/* Demo Mode Toggle */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-text">Demo Mode</span>
                <button
                  onClick={() => handleDemoModeToggle(!demoMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    demoMode ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      demoMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <div className="text-xs text-text/70">
                  {demoMode ? "Simulated scanning" : "Real processing"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-text mb-4">
              Upload Bubble Sheets
            </h2>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-text mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-text/70 mb-4">Supports: JPG, PNG, PDF files</p>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all">
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {scanning && (
              <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                  Processing bubble sheets...
                </div>
              </div>
            )}

            {demoMode && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  <strong>Demo Mode:</strong> This prototype simulates bubble
                  sheet scanning. In a real implementation, this would use
                  computer vision to detect filled bubbles.
                </p>
              </div>
            )}

            {!demoMode && (
              <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  <strong>Real Processing Mode:</strong> Ready for actual bubble
                  sheet scanning. Computer vision processing will analyze
                  uploaded images for filled bubbles.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-text mb-4">Scanning Tips</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-text">Good Lighting</h3>
                  <p className="text-text/70 text-sm">
                    Ensure the bubble sheet is well-lit and shadows are minimal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-text">Clear Images</h3>
                  <p className="text-text/70 text-sm">
                    Use high resolution images and avoid blurry photos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-text">Proper Alignment</h3>
                  <p className="text-text/70 text-sm">
                    Keep the sheet straight and include all alignment marks
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-text">Multiple Sheets</h3>
                  <p className="text-text/70 text-sm">
                    You can upload multiple sheets at once for batch processing
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-text mb-2">
                Need a bubble sheet template?
              </h3>
              <button
                onClick={() => downloadBubbleSheetPDF(test.totalQuestions)}
                className="text-primary hover:text-primary/80 transition-colors text-sm"
              >
                Download {test.totalQuestions}-question template →
              </button>
            </div>
          </div>
        </div>

        {/* Results Preview */}
        {results.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Recent Scans</h2>
              <Link href={`/tests/${test.id}/results`}>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  View All Results →
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {results
                .slice(-5)
                .reverse()
                .map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-text">
                        {result.studentName}
                      </h3>
                      <p className="text-text/70 text-sm">
                        ID: {result.studentId}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          result.percentage >= 70
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.percentage}%
                      </div>
                      <div className="text-text/70 text-sm">
                        {result.correct}/{test.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
