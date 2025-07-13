"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Mail,
  Lock,
  User,
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
  Building,
  Shield,
  Star,
} from "lucide-react";
import { gsap } from "gsap";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

      // Steps animation
      gsap.fromTo(
        ".step-item",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.4,
        }
      );

      // Form fields animation
      gsap.fromTo(
        ".form-field",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.6,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
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
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("snapgrade_users") || "[]"
      );

      // Check if user already exists
      if (existingUsers.find((user: any) => user.email === formData.email)) {
        setError("An account with this email already exists");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        school: formData.school,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("snapgrade_users", JSON.stringify(updatedUsers));

      // Set current user session
      localStorage.setItem("snapgrade_current_user", JSON.stringify(newUser));

      // Success animation before redirect
      gsap.to(formRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => router.push("/dashboard"),
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex"
    >
      {/* Left Side - Steps */}
      <div
        ref={stepsRef}
        className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 items-center justify-center p-12"
      >
        <div className="max-w-lg">
          <div className="mb-8">
            <h3 className="text-3xl font-bold font-heading text-text mb-4">
              Join the Revolution
            </h3>
            <p className="text-lg text-text/70 leading-relaxed">
              Transform your classroom with SnapGrade's intelligent grading
              system.
            </p>
          </div>

          <div className="space-y-8">
            <div className="step-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-2">
                    Create Your Account
                  </h4>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Sign up in minutes with just your basic information. No
                    complex setup required.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-accent">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-2">
                    Design Your Tests
                  </h4>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Create custom bubble sheet tests with our intuitive template
                    system.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-secondary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-2">Scan & Grade</h4>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Upload images or use your camera to instantly grade bubble
                    sheets with AI precision.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-2">
                    Analyze Results
                  </h4>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Get detailed analytics and export results in your preferred
                    format.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl border border-secondary/20">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6 text-secondary" />
              <span className="font-semibold text-text">Free to Start</span>
            </div>
            <p className="text-text/70 text-sm">
              Begin with our free tier and upgrade as your needs grow. No hidden
              fees or surprises.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div ref={logoRef} className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 mb-8 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold font-heading text-text group-hover:text-secondary transition-colors">
                SnapGrade
              </span>
              <Sparkles className="w-5 h-5 text-accent sparkle-icon" />
            </Link>
            <h2 className="text-4xl font-bold font-heading text-text mb-3">
              Create Account
            </h2>
            <p className="text-lg text-text/70">Start grading smarter today</p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            className="mt-8 space-y-6 bg-white rounded-2xl shadow-sm p-8"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="form-field">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-text mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text/40" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="form-field">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-text mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text/40" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-field">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                  placeholder="john.doe@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* School */}
            <div className="form-field">
              <label
                htmlFor="school"
                className="block text-sm font-semibold text-text mb-2"
              >
                School/Institution
                <span className="text-text/50 text-xs ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-text/40" />
                </div>
                <input
                  id="school"
                  name="school"
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                  placeholder="Springfield Elementary"
                  value={formData.school}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-field">
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
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div className="form-field">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-text mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-text/40" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-text/40 hover:text-text/70 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-text/40 hover:text-text/70 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-text/70">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-secondary hover:text-secondary/80 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
