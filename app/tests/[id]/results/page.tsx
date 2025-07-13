"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

  const getClassStats = () => {
    if (results.length === 0) return null;

    const scores = results.map((r) => r.percentage);
    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = results.filter(
      (r) => r.percentage >= (test?.passingScore || 70)
    ).length;

    return {
      average: Math.round(average),
      highest,
      lowest,
      passed,
      total: results.length,
      passRate: Math.round((passed / results.length) * 100),
    };
  };

  const getQuestionAnalysis = (): QuestionAnalysis[] => {
    if (!test || results.length === 0) return [];

    return test.answerKey.map((correctAnswer, index) => {
      const responses = results.map((r) => r.answers[index]);
      const correctCount = responses.filter(
        (answer) => answer === correctAnswer
      ).length;
      const incorrectCount = results.length - correctCount;

      // Find most common wrong answer
      const wrongAnswers = responses.filter(
        (answer) => answer !== correctAnswer
      );
      const wrongAnswerCounts = wrongAnswers.reduce((acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonWrongAnswer =
        Object.keys(wrongAnswerCounts).length > 0
          ? Object.keys(wrongAnswerCounts).reduce((a, b) =>
              wrongAnswerCounts[a] > wrongAnswerCounts[b] ? a : b
            )
          : undefined;

      return {
        questionNumber: index + 1,
        correctAnswer,
        correctCount,
        incorrectCount,
        correctPercentage: Math.round((correctCount / results.length) * 100),
        mostCommonWrongAnswer,
      };
    });
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
      "Passed",
      "Scanned At",
    ];

    const rows = results.map((result) => [
      result.studentName,
      result.studentId,
      result.score.toString(),
      result.percentage.toString(),
      result.correct.toString(),
      result.incorrect.toString(),
      result.percentage >= (test?.passingScore || 70) ? "Yes" : "No",
      new Date(result.scannedAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${test.title}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = getClassStats();
  const questionAnalysis = getQuestionAnalysis();

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
          <h1 className="text-3xl font-bold text-text mb-2">Test Results</h1>
          <p className="text-text/70">{test.title}</p>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <h3 className="text-lg font-medium text-text mb-2">
              No results yet
            </h3>
            <p className="text-text/70 mb-6">
              Scan some bubble sheets to see results and analytics
            </p>
            <Link href={`/tests/${test.id}/scan`}>
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all">
                Start Scanning
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Class Statistics */}
            {stats && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium text-text/70 mb-2">
                    Class Average
                  </h3>
                  <div className="text-3xl font-bold text-text">
                    {stats.average}%
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium text-text/70 mb-2">
                    Pass Rate
                  </h3>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.passRate}%
                  </div>
                  <div className="text-sm text-text/70">
                    {stats.passed}/{stats.total} students
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium text-text/70 mb-2">
                    Highest Score
                  </h3>
                  <div className="text-3xl font-bold text-text">
                    {stats.highest}%
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium text-text/70 mb-2">
                    Lowest Score
                  </h3>
                  <div className="text-3xl font-bold text-text">
                    {stats.lowest}%
                  </div>
                </div>
              </div>
            )}

            {/* Individual Results */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">
                Individual Results
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-text">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text">
                        ID
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text">
                        Score
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text">
                        Percentage
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text">
                        Scanned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-text">
                          {result.studentName}
                        </td>
                        <td className="py-3 px-4 text-text/70">
                          {result.studentId}
                        </td>
                        <td className="py-3 px-4 text-center text-text">
                          {result.correct}/{test.totalQuestions}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-bold ${
                              result.percentage >= (test.passingScore || 70)
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              result.percentage >= (test.passingScore || 70)
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.percentage >= (test.passingScore || 70)
                              ? "Passed"
                              : "Failed"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-text/70 text-sm">
                          {new Date(result.scannedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-text mb-6">
                Question Analysis
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questionAnalysis.map((analysis) => (
                  <div
                    key={analysis.questionNumber}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-text">
                        Q{analysis.questionNumber}
                      </h3>
                      <span className="text-sm text-text/70">
                        Answer: {analysis.correctAnswer}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div
                        className={`text-lg font-bold ${
                          analysis.correctPercentage >= 70
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {analysis.correctPercentage}% correct
                      </div>
                      <div className="text-sm text-text/70">
                        {analysis.correctCount}/{results.length} students
                      </div>
                    </div>
                    {analysis.mostCommonWrongAnswer &&
                      analysis.incorrectCount > 0 && (
                        <div className="text-sm text-text/70">
                          Most common wrong: {analysis.mostCommonWrongAnswer}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
