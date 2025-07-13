"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Sparkles,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  Camera,
  TrendingUp,
} from "lucide-react";
import { gsap } from "gsap";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Animation setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo animation
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, y: -30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
      );

      // Form animation
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
      );

      // Features animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.4,
        }
      );

      // Sparkle animation
      gsap.to(".sparkle-icon", {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call - in prototype, we'll just check localStorage
      const users = JSON.parse(localStorage.getItem("snapgrade_users") || "[]");
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        // Store current user session
        localStorage.setItem("snapgrade_current_user", JSON.stringify(user));

        // Success animation before redirect
        gsap.to(formRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          onComplete: () => router.push("/dashboard"),
        });
      } else {
        setError("Invalid email or password");
        // Error shake animation
        gsap.to(formRef.current, {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(formRef.current, { x: 0 });
          },
        });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex"
    >
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div ref={logoRef} className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 mb-4 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold font-heading text-text group-hover:text-primary transition-colors">
                SnapGrade
              </span>
              <Sparkles className="w-5 h-5 text-accent sparkle-icon" />
            </Link>
            <h2 className="text-4xl font-bold font-heading text-text mb-3">
              Welcome back!
            </h2>
            <p className="text-lg text-text/70">
              Sign in to continue grading with ease
            </p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            className="mt-8 space-y-6 bg-white rounded-2xl shadow-sm p-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-text mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text/40" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-text mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text/40" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-text/40 hover:text-text/70 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-text/40 hover:text-text/70 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-text/70">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Features */}
      <div
        ref={featuresRef}
        className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 items-center justify-center p-12"
      >
        <div className="max-w-lg">
          <div className="mb-8">
            <h3 className="text-3xl font-bold font-heading text-text mb-4">
              Streamline Your Grading
            </h3>
            <p className="text-lg text-text/70 leading-relaxed">
              Experience the future of bubble sheet grading with SnapGrade's
              powerful features.
            </p>
          </div>

          <div className="space-y-6">
            <div className="feature-card flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Smart Scanning</h4>
                <p className="text-text/70 text-sm">
                  AI-powered bubble detection with 99% accuracy
                </p>
              </div>
            </div>

            <div className="feature-card flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">
                  Instant Analytics
                </h4>
                <p className="text-text/70 text-sm">
                  Real-time insights into student performance
                </p>
              </div>
            </div>

            <div className="feature-card flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">
                  Class Management
                </h4>
                <p className="text-text/70 text-sm">
                  Organize students and track progress effortlessly
                </p>
              </div>
            </div>

            <div className="feature-card flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Export Results</h4>
                <p className="text-text/70 text-sm">
                  Download detailed reports in multiple formats
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3 mb-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-semibold text-text">
                Trusted by Educators
              </span>
            </div>
            <p className="text-text/70 text-sm">
              Join thousands of teachers who have simplified their grading
              process with SnapGrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
