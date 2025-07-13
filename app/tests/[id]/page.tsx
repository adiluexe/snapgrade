"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { downloadBubbleSheet } from "@/lib/bubblesheet";

interface Test {
  id: string;
  title: string;
  description: string;
  template: string;
  totalQuestions: number;
  passingScore: number;
  subject: string;
  class: string;
  answerKey: string[];
  createdAt: string;
  status: string;
  studentsGraded: number;
}

export default function TestDetail() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testId = params.id as string;
    const tests = JSON.parse(localStorage.getItem("snapgrade_tests") || "[]");
    const foundTest = tests.find((t: Test) => t.id === testId);

    if (foundTest) {
      setTest(foundTest);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  }, [params.id, router]);

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
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                <span className="text-xl font-bold text-text">SnapGrade</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-text hover:text-primary transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">{test.title}</h1>
          <div className="flex items-center space-x-4 text-text/70">
            <span>{test.totalQuestions} questions</span>
            <span>•</span>
            <span>Created {new Date(test.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                test.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {test.status}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href={`/tests/${test.id}/scan`}>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">Scan Sheets</h3>
              <p className="text-text/70">
                Upload or scan bubble sheets for this test
              </p>
            </div>
          </Link>

          <Link href={`/tests/${test.id}/results`}>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-secondary rounded"></div>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">View Results</h3>
              <p className="text-text/70">See graded results and analytics</p>
            </div>
          </Link>

          <div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => downloadBubbleSheet(test.totalQuestions)}
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-accent rounded"></div>
            </div>
            <h3 className="text-lg font-bold text-text mb-2">
              Download Template
            </h3>
            <p className="text-text/70">
              Get the bubble sheet template for printing
            </p>
          </div>
        </div>

        {/* Test Information */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-text mb-4">Test Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-text">Subject:</span>
                <span className="ml-2 text-text/70">
                  {test.subject || "Not specified"}
                </span>
              </div>
              <div>
                <span className="font-medium text-text">Class/Grade:</span>
                <span className="ml-2 text-text/70">
                  {test.class || "Not specified"}
                </span>
              </div>
              <div>
                <span className="font-medium text-text">Total Questions:</span>
                <span className="ml-2 text-text/70">{test.totalQuestions}</span>
              </div>
              <div>
                <span className="font-medium text-text">Passing Score:</span>
                <span className="ml-2 text-text/70">{test.passingScore}%</span>
              </div>
              <div>
                <span className="font-medium text-text">Students Graded:</span>
                <span className="ml-2 text-text/70">{test.studentsGraded}</span>
              </div>
              {test.description && (
                <div>
                  <span className="font-medium text-text">Description:</span>
                  <p className="mt-1 text-text/70">{test.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-text mb-4">Answer Key</h2>
            <div className="grid grid-cols-10 gap-2 text-sm">
              {test.answerKey.map((answer, index) => (
                <div key={index} className="text-center">
                  <div className="text-text/60 text-xs">Q{index + 1}</div>
                  <div className="font-medium text-text bg-gray-50 rounded py-1">
                    {answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-text mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-text/70">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <p>No sheets scanned yet</p>
            <Link href={`/tests/${test.id}/scan`}>
              <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all">
                Start Scanning
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
