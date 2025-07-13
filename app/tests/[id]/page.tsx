"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { downloadBubbleSheetPDF } from "@/lib/bubblesheet";
import {
  Camera,
  BarChart3,
  Download,
  BookOpen,
  Users,
  Clock,
  Target,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle,
  Activity,
  Zap,
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

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const answerKeyRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

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

  // Animation setup
  useEffect(() => {
    if (!test) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Staggered quick actions animation
      gsap.fromTo(
        ".action-card",
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.2,
        }
      );

      // Details cards animation
      gsap.fromTo(
        ".detail-card",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.4,
        }
      );

      // Answer key animation
      gsap.fromTo(
        ".answer-bubble",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.02,
          ease: "back.out(1.7)",
          delay: 0.6,
        }
      );

      // Activity section
      gsap.fromTo(
        activityRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.8,
        }
      );
    });

    return () => ctx.revert();
  }, [test]);

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
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center animate-pulse-glow">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text mb-1">
                  {test.title}
                </h1>
                <div className="flex items-center space-x-4 text-text/70">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{test.totalQuestions} questions</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(test.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        test.status === "active"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-text/70">
                <Users className="w-4 h-4" />
                <span className="text-sm">{test.studentsGraded} graded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div ref={actionsRef} className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href={`/tests/${test.id}/scan`}>
            <div className="action-card bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border hover:border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex items-center space-x-1 text-primary/70 group-hover:text-primary transition-colors">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">SCAN</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
                Scan Sheets
              </h3>
              <p className="text-text/70 text-sm leading-relaxed">
                Upload or scan bubble sheets for automatic grading
              </p>
              <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                <span>Start scanning</span>
                <Zap className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link href={`/tests/${test.id}/results`}>
            <div className="action-card bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border hover:border-secondary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-secondary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex items-center space-x-1 text-secondary/70 group-hover:text-secondary transition-colors">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium">ANALYZE</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text mb-2 group-hover:text-secondary transition-colors">
                View Results
              </h3>
              <p className="text-text/70 text-sm leading-relaxed">
                See graded results and detailed analytics
              </p>
              <div className="mt-4 flex items-center text-secondary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                <span>View analytics</span>
                <TrendingUp className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <div
            className="action-card bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border hover:border-accent/20"
            onClick={() => downloadBubbleSheetPDF(test.totalQuestions)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Download className="w-6 h-6 text-accent group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex items-center space-x-1 text-accent/70 group-hover:text-accent transition-colors">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">TEMPLATE</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-text mb-2 group-hover:text-accent transition-colors">
              Download Template
            </h3>
            <p className="text-text/70 text-sm leading-relaxed">
              Get the bubble sheet template for printing
            </p>
            <div className="mt-4 flex items-center text-accent text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              <span>Download PDF</span>
              <Download className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div
            ref={detailsRef}
            className="detail-card bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text">Test Details</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="font-medium text-text block">Subject</span>
                  <span className="text-text/70 text-sm">
                    {test.subject || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <span className="font-medium text-text block">
                    Class/Grade
                  </span>
                  <span className="text-text/70 text-sm">
                    {test.class || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <span className="font-medium text-text block">
                    Total Questions
                  </span>
                  <span className="text-text/70 text-sm">
                    {test.totalQuestions}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Target className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <span className="font-medium text-text block">
                    Passing Score
                  </span>
                  <span className="text-text/70 text-sm">
                    {test.passingScore}%
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <span className="font-medium text-text block">
                    Students Graded
                  </span>
                  <span className="text-text/70 text-sm">
                    {test.studentsGraded}
                  </span>
                </div>
              </div>
              {test.description && (
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <span className="font-medium text-text block">
                      Description
                    </span>
                    <p className="text-text/70 text-sm leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            ref={answerKeyRef}
            className="detail-card bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-text">Answer Key</h2>
            </div>
            <div className="grid grid-cols-10 gap-2 text-sm">
              {test.answerKey.map((answer, index) => (
                <div key={index} className="answer-bubble text-center group">
                  <div className="text-text/60 text-xs mb-1">Q{index + 1}</div>
                  <div className="font-medium text-text bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg py-2 px-1 group-hover:from-primary/10 group-hover:to-primary/5 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110">
                    {answer}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="font-medium text-text">Total Questions</span>
                </div>
                <span className="text-text/70 font-bold">
                  {test.answerKey.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          ref={activityRef}
          className="mt-8 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-text">Recent Activity</h2>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 activity-pulse">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text mb-2">
              No sheets scanned yet
            </h3>
            <p className="text-text/60 mb-6 max-w-sm mx-auto">
              Start scanning bubble sheets to see student results and class
              analytics here.
            </p>
            <Link href={`/tests/${test.id}/scan`}>
              <button className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Start Scanning</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
