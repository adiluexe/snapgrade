"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDemoMode, setDemoMode } from "@/lib/bubblesheet";

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

    setLoading(false);
  }, [router]);

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                <span className="text-xl font-bold text-text">SnapGrade</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Demo Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text/70">Demo Mode</span>
                <button
                  onClick={() => handleDemoModeToggle(!demoMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    demoMode ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Enable demo mode</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      demoMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <span className="text-text">Welcome, {user.firstName}!</span>
              <button
                onClick={handleSignOut}
                className="text-text hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-text/70 mb-4">
            Ready to start grading? Create a new test or manage your existing
            ones.
          </p>
          
          {/* Demo Mode Indicator */}
          <div className={`p-4 rounded-lg border ${
            demoMode 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                demoMode ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
              <span className={`font-medium ${
                demoMode ? 'text-blue-700' : 'text-green-700'
              }`}>
                {demoMode ? 'Demo Mode Active' : 'Live Mode Active'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              demoMode ? 'text-blue-600' : 'text-green-600'
            }`}>
              {demoMode 
                ? 'Scanning will generate simulated results for testing purposes'
                : 'Scanning will process actual bubble sheet images'
              }
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/tests/create">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-lg font-bold text-text mb-2">
                Create New Test
              </h3>
              <p className="text-text/70 mb-4">
                Set up a new bubble sheet test with answer keys
              </p>
              <button className="text-primary font-medium hover:text-primary/80">
                Get Started →
              </button>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-accent rounded"></div>
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Scan Sheets</h3>
            <p className="text-text/70 mb-4">
              Use your camera or upload images to scan bubble sheets
            </p>
            <button className="text-primary font-medium hover:text-primary/80">
              Start Scanning →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-secondary rounded"></div>
            </div>
            <h3 className="text-lg font-bold text-text mb-2">View Results</h3>
            <p className="text-text/70 mb-4">
              Access your graded tests and analytics
            </p>
            <button className="text-primary font-medium hover:text-primary/80">
              View Results →
            </button>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-text mb-4">Recent Tests</h2>
          {tests.length === 0 ? (
            <div className="text-center py-12 text-text/70">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <p className="text-lg mb-2">No tests yet</p>
              <p className="text-sm">
                Create your first test to get started with SnapGrade
              </p>
              <Link href="/tests/create">
                <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all">
                  Create New Test
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
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-text mb-1">
                            {test.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-text/70">
                            <span>{test.totalQuestions} questions</span>
                            {test.subject && <span>• {test.subject}</span>}
                            {test.class && <span>• {test.class}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-text/70">
                            {new Date(test.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-medium text-text">
                            {test.studentsGraded} students graded
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              {tests.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    View all tests →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
