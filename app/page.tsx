"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { initializeDemoData } from "@/lib/auth";
import {
  Zap,
  CheckCircle,
  Camera,
  BarChart3,
  Download,
  Clock,
  Users,
  FileText,
  ArrowRight,
  Star,
  ChevronRight,
  BookCheck,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initialize demo data on page load
    initializeDemoData();

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Hero animations
      const tl = gsap.timeline();

      // Animate hero title with stagger effect
      tl.fromTo(
        ".hero-title",
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      )
        .fromTo(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .fromTo(
          ".hero-description",
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".hero-buttons",
          {
            opacity: 0,
            y: 40,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );

      // Floating animation for hero buttons
      gsap.to(".hero-button-primary", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".hero-button-secondary", {
        y: -8,
        duration: 2.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });

      // Features section animations
      gsap.fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 80,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Feature icons hover animations
      gsap.set(".feature-icon", { scale: 1 });

      // Steps section animations
      gsap.fromTo(
        ".step-item",
        {
          opacity: 0,
          y: 60,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.3,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // CTA section animation
      gsap.fromTo(
        ".cta-content",
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax effect for sections
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert(); // Cleanup
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-sm bg-background/90 sticky top-0 z-50">
        <div className="flex items-center space-x-2 group">
          <Zap className="w-5 h-5 text-text group-hover:text-primary transition-colors duration-300 group-hover:rotate-12 transform" />
          <span className="text-xl font-bold font-heading text-text group-hover:text-primary transition-colors duration-300">
            SnapGrade
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 font-heading font-medium">
          <a
            href="#features"
            className="text-text hover:text-primary transition-all duration-300 relative group"
          >
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#how-it-works"
            className="text-text hover:text-primary transition-all duration-300 relative group"
          >
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin">
            <button className="text-text hover:text-primary transition-all duration-300 flex items-center space-x-2 btn-hover-lift">
              <span>Sign In</span>
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 btn-hover-lift group">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6 py-20 lg:px-12 lg:py-32"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="hero-title font-black font-heading text-5xl lg:text-7xl mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-normal">
              SnapGrade
            </span>
          </h1>
          <p className="hero-subtitle text-xl lg:text-2xl text-text mb-4 max-w-3xl mx-auto">
            Streamline your grading process with our AI-powered bubble sheet
            scanner
          </p>
          <p className="hero-description text-lg text-text/80 mb-12 max-w-2xl mx-auto">
            Upload or scan bubble sheets directly from your browser. Get instant
            results, comprehensive analytics, and export data seamlessly.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <button className="hero-button-primary bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all w-full sm:w-auto flex items-center justify-center space-x-2 hover:scale-105 transform duration-200">
                <Zap className="w-5 h-5" />
                <span>Start Grading Now</span>
              </button>
            </Link>
            <button className="hero-button-secondary border-2 border-secondary text-secondary px-8 py-4 rounded-lg text-lg font-medium hover:bg-secondary hover:text-white transition-all w-full sm:w-auto flex items-center justify-center space-x-2 hover:scale-105 transform duration-200">
              <Camera className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="px-6 py-20 lg:px-12 bg-white/50 parallax-bg"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-text mb-16">
            Everything you need to grade efficiently
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="feature-icon w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Webcam Scanning
              </h3>
              <p className="text-text/70">
                Scan bubble sheets directly using your device's camera for
                instant processing.
              </p>
            </div>

            <div className="feature-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="feature-icon w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                AI-Powered Detection
              </h3>
              <p className="text-text/70">
                Advanced computer vision automatically detects and grades filled
                bubbles with high accuracy.
              </p>
            </div>

            <div className="feature-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="feature-icon w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Instant Analytics
              </h3>
              <p className="text-text/70">
                Get immediate insights into class performance and identify
                commonly missed questions.
              </p>
            </div>

            <div className="feature-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="feature-icon w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-4">Easy Export</h3>
              <p className="text-text/70">
                Export results to CSV format for easy integration with your
                gradebook.
              </p>
            </div>

            <div className="feature-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="feature-icon w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Multiple Templates
              </h3>
              <p className="text-text/70">
                Support for various bubble sheet formats including 50 and 100
                question templates.
              </p>
            </div>

            <div className="feature-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="feature-icon w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-6 h-6 text-secondary" />
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
      <section ref={stepsRef} id="how-it-works" className="px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-text mb-16">
            Grading made simple in 4 steps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="step-item text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-text mb-4">Create Test</h3>
              <p className="text-text/70">
                Set up your test and input the answer key
              </p>
            </div>

            <div className="step-item text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-text mb-4">Scan Sheets</h3>
              <p className="text-text/70">
                Upload images or use your webcam to scan
              </p>
            </div>

            <div className="step-item text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-text mb-4">Auto Grade</h3>
              <p className="text-text/70">
                AI processes and grades all sheets instantly
              </p>
            </div>

            <div className="step-item text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <BarChart3 className="w-8 h-8 text-white" />
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
      <section
        ref={ctaRef}
        className="px-6 py-20 lg:px-12 bg-gradient-to-r from-primary/10 to-accent/10"
      >
        <div className="cta-content max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-6">
            Ready to revolutionize your grading?
          </h2>
          <p className="text-lg text-text/80 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who have already simplified their
            grading process with SnapGrade.
          </p>
          <Link href="/auth/signup">
            <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 mx-auto hover:scale-105 transform duration-300 shadow-lg hover:shadow-xl">
              <Star className="w-5 h-5" />
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 lg:px-12 bg-text text-text">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-text" />
                <span className="text-xl font-bold font-heading text-text">
                  SnapGrade
                </span>
              </div>
              <p className="text-text/80">
                Making grading efficient and accurate for educators worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-text">Product</h4>
              <ul className="space-y-2 text-text/80">
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
              <h4 className="font-bold mb-4 text-text">Support</h4>
              <ul className="space-y-2 text-text/80">
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
              <h4 className="font-bold mb-4 text-text">Company</h4>
              <ul className="space-y-2 text-text/80">
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
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-text/60">
            <p>&copy; 2025 SnapGrade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
