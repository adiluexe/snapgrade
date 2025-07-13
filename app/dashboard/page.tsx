"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDemoMode, setDemoMode } from "@/lib/bubblesheet";
import {
  Zap,
  PlusCircle,
  Camera,
  BarChart3,
  LogOut,
  Clock,
  Users,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Award,
  Star,
  Target,
  Calendar,
  FileText,
  Sparkles,
  Activity,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school?: string;
}

interface Test {
  id: string;
  title: string;
  totalQuestions: number;
  createdAt: string;
  studentsGraded: number;
  subject?: string;
  class?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoModeState] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    totalStudents: 0,
    averageScore: 0,
    testsThisWeek: 0,
  });

  // Animation refs
  const mainContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const testsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("snapgrade_current_user");
    if (!currentUser) {
      router.push("/auth/signin");
      return;
    }

    setUser(JSON.parse(currentUser));

    // Load demo mode setting
    setDemoModeState(getDemoMode());

    // Load user's tests
    const existingTests = JSON.parse(
      localStorage.getItem("snapgrade_tests") || "[]"
    );
    setTests(existingTests);

    // Calculate statistics
    const totalStudents = existingTests.reduce(
      (sum: number, test: Test) => sum + (test.studentsGraded || 0),
      0
    );

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const testsThisWeek = existingTests.filter(
      (test: Test) => new Date(test.createdAt) > weekAgo
    ).length;

    setStats({
      totalTests: existingTests.length,
      totalStudents,
      averageScore: 85, // Would calculate from actual results
      testsThisWeek,
    });

    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      const ctx = gsap.context(() => {
        // Navigation animation
        gsap.fromTo(
          navRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Welcome section animation
        gsap.fromTo(
          welcomeRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
        );

        // Stats cards animation
        gsap.fromTo(
          ".stat-card",
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
            delay: 0.4,
          }
        );

        // Quick Actions header animation
        gsap.fromTo(
          ".quick-actions-header",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.6,
          }
        );

        // Quick actions animation
        gsap.fromTo(
          ".quick-action-card",
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.8,
          }
        );

        // Recent tests animation
        gsap.fromTo(
          testsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1 }
        );

        // Test cards stagger animation
        gsap.fromTo(
          ".test-card",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            delay: 1.2,
          }
        );

        // Sparkle animation for demo mode
        if (demoMode) {
          gsap.to(".demo-sparkle", {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: "none",
          });
        }
      }, mainContentRef);

      return () => ctx.revert();
    }
  }, [loading, user, demoMode]);

  const handleDemoModeToggle = (enabled: boolean) => {
    setDemoModeState(enabled);
    setDemoMode(enabled);
  };

  const handleSignOut = () => {
    localStorage.removeItem("snapgrade_current_user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav
        ref={navRef}
        className=" backdrop-blur-md-b-gray-200/50 p-4 top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 group">
                  <Zap className="w-5 h-5 text-text group-hover:text-primary transition-colors duration-300 group-hover:rotate-12 transform" />
                  <span className="text-xl font-bold font-heading text-text group-hover:text-primary transition-colors duration-300">
                    SnapGrade
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-6 font-heading font-medium">
              {/* Demo Mode Toggle */}
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="flex items-center space-x-2">
                  {demoMode ? (
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-accent demo-sparkle" />
                      <span className="text-sm text-text/70">Demo</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-text/70">Live</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDemoModeToggle(!demoMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    demoMode
                      ? "bg-gradient-to-r from-primary to-primary/80"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                >
                  <span className="sr-only">Toggle demo mode</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      demoMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-2 text-text px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm">Welcome, {user.firstName}!</span>
              </div>

              <button
                onClick={handleSignOut}
                className="text-text hover:text-primary transition-all duration-300 flex items-center space-x-2  px-4 py-2 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        ref={mainContentRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Welcome Section */}
        <div ref={welcomeRef} className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 relative overflow-hidden">
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold font-heading text-text mb-3 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span>Welcome back, {user.firstName}!</span>
                  </h1>
                  <p className="text-lg text-text/70 mb-4 max-w-2xl">
                    Ready to streamline your grading process? Create tests, scan
                    bubble sheets, and analyze student performance with ease.
                  </p>

                  {/* Demo Mode Status */}
                  <div
                    className={`inline-flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      demoMode
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50-blue-200/50"
                        : "bg-gradient-to-r from-green-50 to-emerald-50-green-200/50"
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-2 ${
                        demoMode ? "text-blue-700" : "text-green-700"
                      }`}
                    >
                      {demoMode ? (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span className="font-semibold">
                            Demo Mode Active
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">
                            Live Mode Active
                          </span>
                        </>
                      )}
                    </div>
                    <div className="w-px h-6 bg-current opacity-30"></div>
                    <p
                      className={`text-sm ${
                        demoMode ? "text-blue-600" : "text-green-600"
                      }`}
                    >
                      {demoMode
                        ? "Simulated scanning for testing purposes"
                        : "Real bubble sheet processing enabled"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-text/50 mb-1">Current Date</div>
                  <div className="text-lg font-semibold text-text flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="stat-card bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-text">
                  {stats.totalTests}
                </div>
                <div className="text-sm text-text/60">Total Tests</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                {stats.testsThisWeek} this week
              </span>
            </div>
          </div>

          <div className="stat-card bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-text">
                  {stats.totalStudents}
                </div>
                <div className="text-sm text-text/60">Students Graded</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">
                Across all tests
              </span>
            </div>
          </div>

          <div className="stat-card bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-text">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-text/60">Average Score</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-600 font-medium">
                Above benchmark
              </span>
            </div>
          </div>

          <div className="stat-card bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-text">
                  {Math.round(
                    stats.totalStudents / Math.max(stats.totalTests, 1)
                  )}
                </div>
                <div className="text-sm text-text/60">Avg per Test</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">
                Class size
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div ref={actionsRef} className="mb-8">
          <div className="quick-actions-header flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text">Quick Actions</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/tests/create">
              <div className="quick-action-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <PlusCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                    Create New Test
                  </h3>
                  <p className="text-text/70 mb-4 leading-relaxed">
                    Set up a new bubble sheet test with customizable answer keys
                    and scoring options
                  </p>
                  <div className="flex items-center space-x-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-primary to-primary/60 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            <Link
              href={
                tests.length > 0
                  ? `/tests/${tests[0].id}/scan`
                  : "/tests/create"
              }
            >
              <div className="quick-action-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Camera className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-accent transition-colors">
                    Scan Bubble Sheets
                  </h3>
                  <p className="text-text/70 mb-4 leading-relaxed">
                    Use your camera or upload images to scan and grade bubble
                    sheets instantly
                  </p>
                  <div className="flex items-center space-x-2 text-accent font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Start Scanning</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-accent to-accent/60 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            <Link
              href={
                tests.length > 0
                  ? `/tests/${tests[0].id}/results`
                  : "/tests/create"
              }
            >
              <div className="quick-action-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 group h-full">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <BarChart3 className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2 group-hover:text-secondary transition-colors">
                    View Analytics
                  </h3>
                  <p className="text-text/70 mb-4 leading-relaxed">
                    Access detailed grading results, statistics, and performance
                    analytics
                  </p>
                  <div className="flex items-center space-x-2 text-secondary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>View Results</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-secondary to-secondary/60 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Tests */}
        <div
          ref={testsRef}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="px-12 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text">Recent Tests</h2>
              </div>
              {tests.length > 0 && (
                <Link href="/tests">
                  <button className="text-primary hover:text-primary/80 transition-all duration-300 font-medium bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>View All Tests</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="p-8">
            {tests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlusCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">
                  No tests yet
                </h3>
                <p className="text-text/70 mb-6 max-w-md mx-auto">
                  Get started by creating your first bubble sheet test. It only
                  takes a few minutes to set up!
                </p>
                <Link href="/tests/create">
                  <button className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium flex items-center space-x-2 mx-auto">
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Your First Test</span>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tests
                  .slice(-5)
                  .reverse()
                  .map((test) => (
                    <Link key={test.id} href={`/tests/${test.id}`}>
                      <div className="test-card-gray-200 rounded-xl p-5 hover-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-md group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-bold text-text text-lg group-hover:text-primary transition-colors duration-300">
                                  {test.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-text/70">
                                  <div className="flex items-center space-x-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{test.totalQuestions} questions</span>
                                  </div>
                                  {test.subject && (
                                    <>
                                      <span>•</span>
                                      <span>{test.subject}</span>
                                    </>
                                  )}
                                  {test.class && (
                                    <>
                                      <span>•</span>
                                      <span>{test.class}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-2 text-sm text-text/70 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(test.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 text-sm font-medium text-secondary">
                                <Users className="w-4 h-4" />
                                <span>{test.studentsGraded || 0} graded</span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-text/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-4 flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (test.studentsGraded || 0) * 10
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-text/60 font-medium">
                            {test.studentsGraded || 0 > 0 ? "Active" : "Ready"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                {tests.length > 5 && (
                  <div className="text-center pt-6">
                    <Link href="/tests">
                      <button className="text-primary hover:text-primary/80 transition-all duration-300 font-medium bg-primary/5 px-6 py-3 rounded-xl hover:bg-primary/10 hover:scale-105 flex items-center space-x-2 mx-auto">
                        <BookOpen className="w-4 h-4" />
                        <span>View all {tests.length} tests</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
