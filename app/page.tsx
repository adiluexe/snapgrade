'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { initializeDemoData } from "@/lib/auth";

export default function Home() {
  useEffect(() => {
    // Initialize demo data on page load
    initializeDemoData();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
          <span className="text-xl font-bold text-text">SnapGrade</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-text hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-text hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-text hover:text-primary transition-colors"
          >
            Pricing
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin">
            <button className="text-text hover:text-primary transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              SnapGrade
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-text mb-4 max-w-3xl mx-auto">
            Streamline your grading process with our AI-powered bubble sheet
            scanner
          </p>
          <p className="text-lg text-text/80 mb-12 max-w-2xl mx-auto">
            Upload or scan bubble sheets directly from your browser. Get instant
            results, comprehensive analytics, and export data seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all w-full sm:w-auto">
                Start Grading Now
              </button>
            </Link>
            <button className="border-2 border-secondary text-secondary px-8 py-4 rounded-lg text-lg font-medium hover:bg-secondary hover:text-white transition-all w-full sm:w-auto">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 lg:px-12 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-text mb-16">
            Everything you need to grade efficiently
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Webcam Scanning
              </h3>
              <p className="text-text/70">
                Scan bubble sheets directly using your device's camera for
                instant processing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-accent rounded"></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                AI-Powered Detection
              </h3>
              <p className="text-text/70">
                Advanced computer vision automatically detects and grades filled
                bubbles with high accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-secondary rounded"></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Instant Analytics
              </h3>
              <p className="text-text/70">
                Get immediate insights into class performance and identify
                commonly missed questions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4">Easy Export</h3>
              <p className="text-text/70">
                Export results to CSV format for easy integration with your
                gradebook.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-accent rounded"></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Multiple Templates
              </h3>
              <p className="text-text/70">
                Support for various bubble sheet formats including 50 and 100
                question templates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-secondary rounded"></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Student Management
              </h3>
              <p className="text-text/70">
                Organize your students and track individual performance over
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-text mb-16">
            Grading made simple in 4 steps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-text mb-4">Create Test</h3>
              <p className="text-text/70">
                Set up your test and input the answer key
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-text mb-4">Scan Sheets</h3>
              <p className="text-text/70">
                Upload images or use your webcam to scan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-text mb-4">Auto Grade</h3>
              <p className="text-text/70">
                AI processes and grades all sheets instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                4
              </div>
              <h3 className="text-lg font-bold text-text mb-4">View Results</h3>
              <p className="text-text/70">
                Access analytics and export your data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-12 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-6">
            Ready to revolutionize your grading?
          </h2>
          <p className="text-lg text-text/80 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who have already simplified their
            grading process with SnapGrade.
          </p>
          <Link href="/auth/signup">
            <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all">
              Get Started for Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 lg:px-12 bg-text text-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                <span className="text-xl font-bold text-background">SnapGrade</span>
              </div>
              <p className="text-background/80">
                Making grading efficient and accurate for educators worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-background">Product</h4>
              <ul className="space-y-2 text-background/80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-background">Support</h4>
              <ul className="space-y-2 text-background/80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-background">Company</h4>
              <ul className="space-y-2 text-background/80">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <p>&copy; 2025 SnapGrade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
