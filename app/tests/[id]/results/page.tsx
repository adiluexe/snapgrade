"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  FileText,
  Award,
  Activity,
  PieChart,
  Eye,
  ArrowUp,
  ArrowDown,
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

interface QuestionAnalysis {
  questionNumber: number;
  correctAnswer: string;
  correctCount: number;
  incorrectCount: number;
  correctPercentage: number;
  mostCommonWrongAnswer?: string;
}

export default function TestResults() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const testId = params.id as string;
    const tests = JSON.parse(localStorage.getItem("snapgrade_tests") || "[]");
    const foundTest = tests.find((t: Test) => t.id === testId);

    if (foundTest) {
      setTest(foundTest);
      const existingResults = JSON.parse(
        localStorage.getItem(`snapgrade_results_${testId}`) || "[]"
      );
      setResults(existingResults);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  }, [params.id, router]);

  // Animation setup
  useEffect(() => {
    if (!test || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Header animation
      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })

        // Stats cards staggered animation
        .from(
          ".stats-card",
          {
            y: 50,
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )

        // Table animation
        .from(
          ".result-row",
          {
            x: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, [test, loading, results]);

  const getClassStatistics = () => {
    if (results.length === 0) return null;

    const scores = results.map((r) => r.percentage);
    const average = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = results.filter(
      (r) => r.percentage >= test!.passingScore
    ).length;

    return {
      average,
      highest,
      lowest,
      passed,
      total: results.length,
      passRate: Math.round((passed / results.length) * 100),
    };
  };

  const exportToCSV = () => {
    if (!test || results.length === 0) return;

    const headers = [
      "Student Name",
      "Student ID",
      "Score",
      "Percentage",
      "Correct",
      "Incorrect",
      "Status",
      "Scanned At",
    ];

    const csvContent = [
      headers.join(","),
      ...results.map((result) =>
        [
          result.studentName,
          result.studentId,
          result.score,
          result.percentage,
          result.correct,
          result.incorrect,
          result.percentage >= test.passingScore ? "Pass" : "Fail",
          new Date(result.scannedAt).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${test.title}_results.csv`;
    link.click();
    URL.revokeObjectURL(url);
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

  const stats = getClassStatistics();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center animate-pulse-glow">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text mb-1 font-heading">
                  Test Results
                </h1>
                <div className="flex items-center space-x-2 text-text/70">
                  <FileText className="w-4 h-4" />
                  <span>{test.title}</span>
                  <span>•</span>
                  <Users className="w-4 h-4" />
                  <span>{results.length} students</span>
                </div>
              </div>
            </div>
            {results.length > 0 && (
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-secondary to-secondary/90 text-white px-6 py-3 rounded-lg font-medium hover:from-secondary/90 hover:to-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Export CSV</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 activity-pulse">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">No results yet</h3>
            <p className="text-text/70 mb-8 max-w-md mx-auto">
              Scan some bubble sheets to see detailed results, analytics, and
              class performance insights.
            </p>
            <Link href={`/tests/${test.id}/scan`}>
              <button className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-4 rounded-lg font-medium hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Start Scanning</span>
                </div>
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Class Statistics */}
            {stats && (
              <div
                ref={statsRef}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <div className="stats-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border hover:border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      AVERAGE
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text/70 mb-1">
                    Class Average
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {stats.average}%
                  </div>
                  <div className="text-xs text-text/60">
                    Across {stats.total} students
                  </div>
                </div>

                <div className="stats-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border hover:border-green-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      PASS RATE
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text/70 mb-1">
                    Pass Rate
                  </h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {stats.passRate}%
                  </div>
                  <div className="text-xs text-text/60">
                    {stats.passed} of {stats.total} students
                  </div>
                </div>

                <div className="stats-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border hover:border-emerald-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                      <ArrowUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      HIGHEST
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text/70 mb-1">
                    Highest Score
                  </h3>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {stats.highest}%
                  </div>
                  <div className="text-xs text-text/60">Best performance</div>
                </div>

                <div className="stats-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border hover:border-red-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                      <ArrowDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      LOWEST
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text/70 mb-1">
                    Lowest Score
                  </h3>
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {stats.lowest}%
                  </div>
                  <div className="text-xs text-text/60">Needs attention</div>
                </div>
              </div>
            )}

            {/* Student Results Table */}
            <div
              ref={tableRef}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-bold text-text">Student Results</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-text/70">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text/70">
                        ID
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text/70">
                        Score
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text/70">
                        Percentage
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text/70">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text/70">
                        Scanned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr
                        key={result.id}
                        className="result-row border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {result.studentName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-text">
                              {result.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-text/70">
                          {result.studentId}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-text">
                            {result.correct}
                          </span>
                          <span className="text-text/70">
                            /{test.totalQuestions}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`font-bold ${
                              result.percentage >= test.passingScore
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              result.percentage >= test.passingScore
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.percentage >= test.passingScore ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {result.percentage >= test.passingScore
                              ? "Pass"
                              : "Fail"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-text/70 text-sm">
                          {new Date(result.scannedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
