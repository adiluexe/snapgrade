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
  Sparkles,
  Shield,
  Timer,
  TrendingUp,
  Award,
  Rocket,
  Play,
  Target,
  Globe,
  Heart,
  Coffee,
  Brain,
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
  const navRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initialize demo data on page load
    initializeDemoData();

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Navigation entrance animation
      gsap.fromTo(
        navRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Hero animations with enhanced effects
      const tl = gsap.timeline();

      // Animate hero title with stagger effect and sparkle animation
      tl.fromTo(
        ".hero-title",
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotationX: 90,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.5,
          ease: "power3.out",
        }
      )
        .fromTo(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8"
        )
        .fromTo(
          ".hero-description",
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .fromTo(
          ".hero-buttons",
          {
            opacity: 0,
            y: 40,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .fromTo(
          ".hero-stats",
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.2"
        );

      // Enhanced floating animations for hero elements
      gsap.to(".hero-button-primary", {
        y: -12,
        duration: 2.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".hero-button-secondary", {
        y: -8,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });

      // Sparkle animation for hero title
      gsap.to(".hero-sparkle", {
        scale: 1.5,
        opacity: 0.8,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      // Enhanced features section animations
      gsap.fromTo(
        ".features-title",
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotationY: 15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 75%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Enhanced steps section animations
      gsap.fromTo(
        ".steps-title",
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".step-item",
        {
          opacity: 0,
          y: 80,
          scale: 0.7,
          rotation: 5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(1.7)",
          stagger: 0.2,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 75%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Enhanced CTA section animation
      gsap.fromTo(
        ".cta-content",
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stats section animations
      gsap.fromTo(
        ".stat-item",
        {
          opacity: 0,
          y: 40,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax effects
      gsap.to(".parallax-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Enhanced hover animations
      const featureCards = document.querySelectorAll(".feature-card");
      featureCards.forEach((card) => {
        const icon = card.querySelector(".feature-icon");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Step item hover animations
      const stepItems = document.querySelectorAll(".step-item");
      stepItems.forEach((item) => {
        const circle = item.querySelector(".step-circle");

        item.addEventListener("mouseenter", () => {
          gsap.to(circle, {
            scale: 1.15,
            rotation: 360,
            duration: 0.6,
            ease: "back.out(1.7)",
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(circle, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    }, heroRef);

    return () => ctx.revert(); // Cleanup
  }, []);
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

      {/* Navigation */}
      <nav
        ref={navRef}
        className="flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-md bg-background/95 sticky top-0 z-50 border-b border-primary/10"
      >
        <div className="flex items-center space-x-1 group cursor-pointer">
          <div className="relative">
            <Zap className="w-6 h-6 text-text group-hover:text-primary transition-colors duration-300 group-hover:rotate-12 transform" />
          </div>
          <span className="text-xl font-bold font-heading text-text group-hover:text-primary transition-colors duration-300">
            SnapGrade
          </span>
        </div>
        <div className="hidden md:flex items-center justify-center space-x-8 font-heading font-medium">
          <a
            href="#features"
            className="text-text hover:text-primary transition-all duration-300 relative group flex items-center space-x-1"
          >
            <Star className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span>Features</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#how-it-works"
            className="text-text hover:text-primary transition-all duration-300 relative group flex items-center space-x-1"
          >
            <Rocket className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span>How It Works</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin">
            <button className="text-text hover:text-primary transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary/10 group">
              <span>Sign In</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center space-x-2 group">
              <Sparkles className="w-4 h-4" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6 py-20 lg:px-12 lg:py-32 relative"
      >
        {/* Floating shapes background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl hero-sparkle"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl hero-sparkle"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl hero-sparkle"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Hero title with enhanced styling */}
          <div className="relative mb-8">
            <h1 className="hero-title font-black font-heading text-5xl lg:text-8xl mb-6 relative">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient tracking-tight">
                SnapGrade
              </span>
              <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-primary/60 hero-sparkle" />
              <Sparkles className="absolute top-1/2 -left-6 w-6 h-6 text-accent/60 hero-sparkle" />
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10 hero-sparkle"></div>
          </div>

          <p className="hero-subtitle text-xl lg:text-3xl text-text mb-6 max-w-4xl mx-auto font-medium">
            <span className="text-primary font-semibold">AI-Powered</span>{" "}
            bubble sheet scanner that
            <span className="text-accent font-semibold"> revolutionizes </span>
            your grading workflow
          </p>

          <p className="hero-description text-lg lg:text-xl text-text/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload or scan bubble sheets directly from your browser. Get instant
            results, comprehensive analytics, and export data seamlessly - all
            in seconds.
          </p>

          {/* Enhanced hero buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/auth/signup">
              <button className="hero-button-primary bg-gradient-to-r from-primary to-accent text-white px-10 py-5 rounded-xl text-lg font-semibold transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-primary/25 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start Grading Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
            <button className="hero-button-secondary border-2 border-secondary/30 bg-white/50 backdrop-blur-sm text-secondary px-10 py-5 rounded-xl text-lg font-semibold hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-3 hover:shadow-xl group">
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Hero stats */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="stat-item text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20">
              <div className="flex items-center justify-center mb-2">
                <Timer className="w-6 h-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-primary">2s</span>
              </div>
              <p className="text-sm text-text/70 font-medium">
                Average Scan Time
              </p>
            </div>
            <div className="stat-item text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-accent/20">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-accent mr-2" />
                <span className="text-2xl font-bold text-accent">99.8%</span>
              </div>
              <p className="text-sm text-text/70 font-medium">Accuracy Rate</p>
            </div>
            <div className="stat-item text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-secondary/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-secondary mr-2" />
                <span className="text-2xl font-bold text-secondary">10K+</span>
              </div>
              <p className="text-sm text-text/70 font-medium">
                Teachers Trust Us
              </p>
            </div>
            <div className="stat-item text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-primary">5M+</span>
              </div>
              <p className="text-sm text-text/70 font-medium">Tests Graded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="px-6 py-24 lg:px-12 bg-gradient-to-b from-white/80 to-white/40 parallax-bg relative"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="features-title text-4xl lg:text-5xl font-bold text-text mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                grade efficiently
              </span>
            </h2>
            <p className="text-lg text-text/70 max-w-3xl mx-auto">
              Powerful features designed specifically for educators who want to
              save time and improve accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-primary/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary transition-colors duration-300">
                  Smart Webcam Scanning
                </h3>
                <p className="text-text/70 leading-relaxed">
                  Advanced computer vision technology scans bubble sheets
                  directly through your camera with real-time preview and
                  instant feedback.
                </p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-accent/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-accent transition-colors duration-300">
                  AI-Powered Detection
                </h3>
                <p className="text-text/70 leading-relaxed">
                  Machine learning algorithms automatically detect and interpret
                  filled bubbles with 99.8% accuracy, even on low-quality scans.
                </p>
                <div className="mt-4 flex items-center text-accent font-medium">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-secondary/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-secondary transition-colors duration-300">
                  Instant Analytics Dashboard
                </h3>
                <p className="text-text/70 leading-relaxed">
                  Get immediate insights into class performance, identify
                  problem areas, and track student progress with beautiful
                  visualizations.
                </p>
                <div className="mt-4 flex items-center text-secondary font-medium">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-primary/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary transition-colors duration-300">
                  Seamless Data Export
                </h3>
                <p className="text-text/70 leading-relaxed">
                  Export results to CSV, Excel, or integrate directly with
                  popular gradebook systems. Your data, your way.
                </p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-accent/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-accent transition-colors duration-300">
                  Flexible Templates
                </h3>
                <p className="text-text/70 leading-relaxed">
                  Support for 25, 50, 100+ question formats with A-F answer
                  choices. Custom templates coming soon!
                </p>
                <div className="mt-4 flex items-center text-accent font-medium">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="feature-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-secondary/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-secondary transition-colors duration-300">
                  Secure & Private
                </h3>
                <p className="text-text/70 leading-relaxed">
                  Your student data is encrypted and protected. FERPA compliant
                  with enterprise-grade security standards.
                </p>
                <div className="mt-4 flex items-center text-secondary font-medium">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={stepsRef}
        id="how-it-works"
        className="px-6 py-24 lg:px-12 relative"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-10 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="steps-title text-4xl lg:text-5xl font-bold text-text mb-6">
              Grading made
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                simple{" "}
              </span>
              in 4 steps
            </h2>
            <p className="text-lg text-text/70 max-w-3xl mx-auto">
              From setup to results in under 5 minutes. Our streamlined process
              makes grading effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="step-item text-center group">
              <div className="relative mb-8">
                <div className="step-circle w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FileText className="w-10 h-10 text-white relative z-10" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent hidden lg:block transform -translate-y-1/2"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary transition-colors duration-300">
                Create Your Test
              </h3>
              <p className="text-text/70 leading-relaxed">
                Set up your test parameters and input the answer key using our
                intuitive interface
              </p>
            </div>

            <div className="step-item text-center group">
              <div className="relative mb-8">
                <div className="step-circle w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <Camera className="w-10 h-10 text-white relative z-10" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-accent/30 to-transparent hidden lg:block transform -translate-y-1/2"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4 group-hover:text-accent transition-colors duration-300">
                Scan Answer Sheets
              </h3>
              <p className="text-text/70 leading-relaxed">
                Use your webcam or upload images of completed bubble sheets with
                real-time preview
              </p>
            </div>

            <div className="step-item text-center group">
              <div className="relative mb-8">
                <div className="step-circle w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <Zap className="w-10 h-10 text-white relative z-10" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-secondary/30 to-transparent hidden lg:block transform -translate-y-1/2"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-secondary">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4 group-hover:text-secondary transition-colors duration-300">
                Instant AI Grading
              </h3>
              <p className="text-text/70 leading-relaxed">
                Our AI processes and grades all sheets automatically with 99.8%
                accuracy in seconds
              </p>
            </div>

            <div className="step-item text-center group">
              <div className="relative mb-8">
                <div className="step-circle w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <BarChart3 className="w-10 h-10 text-white relative z-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary transition-colors duration-300">
                Analyze & Export
              </h3>
              <p className="text-text/70 leading-relaxed">
                View comprehensive analytics and export results to your
                preferred format
              </p>
            </div>
          </div>

          {/* Additional benefits */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-primary/10">
              <Timer className="w-8 h-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold text-text mb-2">Save 90% of Time</h4>
              <p className="text-text/70 text-sm">
                What used to take hours now takes minutes
              </p>
            </div>
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-accent/10">
              <Target className="w-8 h-8 text-accent mx-auto mb-4" />
              <h4 className="font-semibold text-text mb-2">Eliminate Errors</h4>
              <p className="text-text/70 text-sm">
                AI accuracy surpasses manual grading
              </p>
            </div>
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-secondary/10">
              <Heart className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h4 className="font-semibold text-text mb-2">
                Love Teaching Again
              </h4>
              <p className="text-text/70 text-sm">
                Spend more time with students, less on grading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialRef}
        className="px-6 py-24 lg:px-12 bg-gradient-to-b from-white/60 to-white/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6 leading-tight">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-black relative">
                educators
                <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-lg -z-10"></span>
              </span>{" "}
              worldwide
            </h2>
            <p className="text-xl text-text/80 max-w-3xl mx-auto font-medium">
              See what teachers are saying about SnapGrade
            </p>
            <div className="flex items-center justify-center mt-4 space-x-6">
              <div className="flex items-center space-x-2 text-primary">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-semibold">10,000+ Happy Teachers</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-accent" />
                ))}
                <span className="ml-2 font-semibold text-text">
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary/10 group hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-text/80 mb-6 italic leading-relaxed">
                "SnapGrade has completely transformed how I handle assessments.
                What used to take me hours now takes minutes, and the accuracy
                is incredible!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">MJ</span>
                </div>
                <div>
                  <p className="font-semibold text-text">Maria Johnson</p>
                  <p className="text-text/60 text-sm">
                    High School Math Teacher
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-accent/10 group hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-text/80 mb-6 italic leading-relaxed">
                "The analytics feature is a game-changer. I can instantly see
                which concepts my students are struggling with and adjust my
                teaching accordingly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">DR</span>
                </div>
                <div>
                  <p className="font-semibold text-text">David Rodriguez</p>
                  <p className="text-text/60 text-sm">
                    Middle School Science Teacher
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-secondary/10 group hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-text/80 mb-6 italic leading-relaxed">
                "As a department head, I've rolled this out to our entire team.
                The time savings and consistency in grading has been
                remarkable."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">SL</span>
                </div>
                <div>
                  <p className="font-semibold text-text">Sarah Lee</p>
                  <p className="text-text/60 text-sm">
                    English Department Head
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="px-6 py-24 lg:px-12 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="cta-content max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-text mb-6 leading-tight">
              Ready to
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                revolutionize{" "}
              </span>
              your grading?
            </h2>
            <p className="text-xl text-text/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of educators who have already simplified their
              grading process and
              <span className="text-primary font-semibold">
                {" "}
                saved hundreds of hours{" "}
              </span>
              with SnapGrade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/auth/signup">
              <button className="bg-gradient-to-r from-primary to-accent text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-primary/30 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
            <div className="flex items-center space-x-4 text-text/70">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>30-day free trial</span>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20">
              <Coffee className="w-6 h-6 text-primary" />
              <span className="text-text font-medium">5-min setup</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-accent/20">
              <Globe className="w-6 h-6 text-accent" />
              <span className="text-text font-medium">Works anywhere</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-secondary/20">
              <Shield className="w-6 h-6 text-secondary" />
              <span className="text-text font-medium">FERPA compliant</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20">
              <Award className="w-6 h-6 text-primary" />
              <span className="text-text font-medium">Award winning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 lg:px-12 bg-gradient-to-b from-text to-text/90 text-text relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-1 mb-6 group cursor-pointer">
                <div className="relative">
                  <Zap className="w-6 h-6 text-text group-hover:text-primary transition-colors duration-300 group-hover:rotate-12 transform" />
                </div>
                <span className="text-xl font-bold font-heading text-text group-hover:text-primary transition-colors duration-300">
                  SnapGrade
                </span>
              </div>
              <p className="text-text/80 mb-6 leading-relaxed max-w-md">
                Empowering educators worldwide with AI-powered grading
                solutions. Making assessment faster, more accurate, and
                meaningful.
              </p>
            </div>

            {/* Links columns */}
            <div>
              <h4 className="font-bold mb-6 text-primary flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-primary" />
                <span>Product</span>
              </h4>
              <ul className="space-y-3 text-text/80">
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Features</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Templates</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Analytics</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Integrations</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-accent flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent" />
                <span>Support</span>
              </h4>
              <ul className="space-y-3 text-text/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Help Center</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Contact</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Documentation</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Training</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-secondary flex items-center space-x-2">
                <Globe className="w-5 h-5 text-secondary" />
                <span>Company</span>
              </h4>
              <ul className="space-y-3 text-text/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-secondary transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Careers</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-text/60">
                <p>&copy; 2025 SnapGrade. All rights reserved.</p>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm">Made with love for educators</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-text/60">
                  <span className="text-sm">Trusted by schools worldwide</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current text-accent"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
