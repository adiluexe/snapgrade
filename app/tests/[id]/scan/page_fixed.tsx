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
  ScanLine,
  Image as ImageIcon,
  Video,
  Eye,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Test {
  id: string;
  title: string;
  totalQuestions: number;
  answerKey: string[];
  passingScore: number;
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

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Animation setup
  useEffect(() => {
    if (!test) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Scanner section animation
      gsap.fromTo(
        scannerRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.2,
        }
      );

      // Results animation
      if (results.length > 0) {
        gsap.fromTo(
          ".result-card",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.4,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [test, results]);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center animate-pulse-glow">
                <ScanLine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text mb-1 font-heading">
                  Scan Bubble Sheets
                </h1>
                <div className="flex items-center space-x-2 text-text/70">
                  <FileText className="w-4 h-4" />
                  <span>Test: {test.title}</span>
                  <span>•</span>
                  <Users className="w-4 h-4" />
                  <span>{results.length} scanned</span>
                </div>
              </div>
            </div>

            {/* Demo Mode Toggle */}
            <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-text">
                    Demo Mode
                  </span>
                </div>
                <button
                  onClick={() => handleDemoModeToggle(!demoMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    demoMode
                      ? "bg-gradient-to-r from-primary to-primary/80"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
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
          <div
            ref={scannerRef}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-text">
                Upload Bubble Sheets
              </h2>
            </div>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />

              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>

              <h3 className="text-lg font-medium text-text mb-2">
                Upload bubble sheet images
              </h3>
              <p className="text-text/70 mb-4">
                Drag and drop images here, or click to select files
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? "Processing..." : "Select Files"}
              </button>
            </div>

            {demoMode && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  <strong>Demo Mode:</strong> Simulated bubble detection will
                  generate random but realistic results for testing purposes.
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
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-text">Scanning Tips</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-text flex items-center space-x-2">
                    <ScanLine className="w-4 h-4 text-green-600" />
                    <span>Good Lighting</span>
                  </h3>
                  <p className="text-text/70 text-sm">
                    Ensure the bubble sheet is well-lit and shadows are minimal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-text flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Clear Images</span>
                  </h3>
                  <p className="text-text/70 text-sm">
                    Use high resolution images and avoid blurry photos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-text flex items-center space-x-2">
                    <ScanLine className="w-4 h-4 text-purple-600" />
                    <span>Proper Alignment</span>
                  </h3>
                  <p className="text-text/70 text-sm">
                    Keep the sheet straight and include all alignment marks
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-text flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>Multiple Sheets</span>
                  </h3>
                  <p className="text-text/70 text-sm">
                    You can upload multiple sheets at once for batch processing
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-text mb-2 flex items-center space-x-2">
                <Download className="w-4 h-4 text-primary" />
                <span>Need a bubble sheet template?</span>
              </h3>
              <button
                onClick={() => downloadBubbleSheetPDF(test.totalQuestions)}
                className="text-primary hover:text-primary/80 transition-all duration-300 text-sm font-medium bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download {test.totalQuestions}-question template</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Results Preview */}
        {results.length > 0 && (
          <div
            ref={resultsRef}
            className="mt-8 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-text">Recent Scans</h2>
              </div>
              <Link href={`/tests/${test.id}/results`}>
                <button className="text-primary hover:text-primary/80 transition-all duration-300 font-medium bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>View All Results</span>
                  </div>
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
                    className="result-card flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text">
                          {result.studentName}
                        </h3>
                        <p className="text-text/70 text-sm flex items-center space-x-1">
                          <span>ID: {result.studentId}</span>
                          <span>•</span>
                          <span>
                            {new Date(result.scannedAt).toLocaleTimeString()}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          result.percentage >= (test?.passingScore || 70)
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
