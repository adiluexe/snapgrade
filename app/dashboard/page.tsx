'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('snapgrade_current_user');
    if (!currentUser) {
      router.push('/auth/signin');
      return;
    }

    setUser(JSON.parse(currentUser));
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('snapgrade_current_user');
    router.push('/');
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
          <p className="text-text/70">
            Ready to start grading? Create a new test or manage your existing ones.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary rounded"></div>
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Create New Test</h3>
            <p className="text-text/70 mb-4">
              Set up a new bubble sheet test with answer keys
            </p>
            <button className="text-primary font-medium hover:text-primary/80">
              Get Started →
            </button>
          </div>

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
          <div className="text-center py-12 text-text/70">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <p className="text-lg mb-2">No tests yet</p>
            <p className="text-sm">Create your first test to get started with SnapGrade</p>
            <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all">
              Create New Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
