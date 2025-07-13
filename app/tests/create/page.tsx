"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { templateConfigs } from "@/lib/bubblesheet";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Settings,
  Key,
  CheckCircle,
  Users,
  Clock,
  Target,
  BookOpen,
  GraduationCap,
  Zap,
  Plus,
  Edit,
  Eye,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CreateTest() {
  const [testData, setTestData] = useState({
    title: "",
    description: "",
    template: "50", // Default to 50 questions
    totalQuestions: 50,
    passingScore: 70,
    subject: "",
    class: "",
  });
  const [answerKey, setAnswerKey] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Convert templateConfigs to the format expected by the component
  const templates = Object.entries(templateConfigs).map(([key, config]) => ({
    id: key,
    name: config.name,
    questions: parseInt(key),
    description: config.description,
  }));

  const answerOptions = ["A", "B", "C", "D", "E"];

  // Animation setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Stepper animation
      gsap.fromTo(
        stepperRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.2,
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
      );
    });

    return () => ctx.revert();
  }, []);

  // Step change animation
  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [currentStep]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTestData({
        ...testData,
        template: templateId,
        totalQuestions: template.questions,
      });
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswerKey = [...answerKey];
    newAnswerKey[questionIndex] = answer;
    setAnswerKey(newAnswerKey);
  };

  const createTest = () => {
    if (answerKey.some((answer) => !answer)) {
      setError("Please answer all questions");
      return;
    }

    const newTest = {
      id: Date.now().toString(),
      ...testData,
      answerKey,
      createdAt: new Date().toISOString(),
      status: "active",
      studentsGraded: 0,
    };

    const existingTests = JSON.parse(
      localStorage.getItem("snapgrade_tests") || "[]"
    );
    const updatedTests = [...existingTests, newTest];
    localStorage.setItem("snapgrade_tests", JSON.stringify(updatedTests));

    // Redirect to test details
    router.push(`/tests/${newTest.id}`);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!testData.title.trim()) {
        setError("Please enter a test title");
        return;
      }
      // Initialize answer key
      setAnswerKey(new Array(testData.totalQuestions).fill("A"));
    }
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center animate-pulse-glow">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-text font-heading">
              Create New Test
            </h1>
          </div>
          <p className="text-text/70 max-w-2xl mx-auto">
            Set up your bubble sheet test with customizable templates and answer
            keys for quick grading.
          </p>
        </div>

        {/* Progress Steps */}
        <div ref={stepperRef} className="mb-12">
          <div className="flex items-center justify-center space-x-8 max-w-2xl mx-auto">
            <div
              className={`flex items-center transition-all duration-500 ${
                currentStep >= 1 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  currentStep >= 1
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg scale-110"
                    : "bg-gray-200"
                }`}
              >
                {currentStep > 1 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Settings className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <span className="font-bold text-sm block">Step 1</span>
                <span className="text-xs">Test Details</span>
              </div>
            </div>

            <div
              className={`w-20 h-1 rounded-full transition-all duration-500 ${
                currentStep >= 2
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : "bg-gray-200"
              }`}
            ></div>

            <div
              className={`flex items-center transition-all duration-500 ${
                currentStep >= 2 ? "text-secondary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  currentStep >= 2
                    ? "bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-lg scale-110"
                    : "bg-gray-200"
                }`}
              >
                {currentStep > 2 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Key className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <span className="font-bold text-sm block">Step 2</span>
                <span className="text-xs">Answer Key</span>
              </div>
            </div>

            <div
              className={`w-20 h-1 rounded-full transition-all duration-500 ${
                currentStep >= 3
                  ? "bg-gradient-to-r from-secondary to-accent"
                  : "bg-gray-200"
              }`}
            ></div>

            <div
              className={`flex items-center transition-all duration-500 ${
                currentStep >= 3 ? "text-accent" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  currentStep >= 3
                    ? "bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg scale-110"
                    : "bg-gray-200"
                }`}
              >
                <Eye className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <span className="font-bold text-sm block">Step 3</span>
                <span className="text-xs">Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div ref={contentRef}>
          {/* Step 1: Test Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text">
                  Test Configuration
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-text mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Test Title *</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-all"
                      placeholder="e.g., Math Quiz Chapter 5"
                      value={testData.title}
                      onChange={(e) =>
                        setTestData({ ...testData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-text mb-2">
                      <BookOpen className="w-4 h-4 text-secondary" />
                      <span>Subject</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition-all"
                      placeholder="e.g., Mathematics, Science"
                      value={testData.subject}
                      onChange={(e) =>
                        setTestData({ ...testData, subject: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-text mb-2">
                      <GraduationCap className="w-4 h-4 text-accent" />
                      <span>Class/Grade</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent transition-all"
                      placeholder="e.g., Grade 10, AP Biology"
                      value={testData.class}
                      onChange={(e) =>
                        setTestData({ ...testData, class: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-text mb-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span>Passing Score (%)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="70"
                      value={testData.passingScore}
                      onChange={(e) =>
                        setTestData({
                          ...testData,
                          passingScore: parseInt(e.target.value) || 70,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-text mb-2">
                    <Edit className="w-4 h-4 text-purple-600" />
                    <span>Description (Optional)</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
                    rows={3}
                    placeholder="Brief description of the test content or instructions..."
                    value={testData.description}
                    onChange={(e) =>
                      setTestData({ ...testData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-text mb-4">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Select Template</span>
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateChange(template.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          testData.template === template.id
                            ? "border-primary bg-primary/5 shadow-lg scale-105"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg">
                            {template.questions}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-full border-2 ${
                              testData.template === template.id
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {testData.template === template.id && (
                              <CheckCircle className="w-4 h-4 text-white m-0.5" />
                            )}
                          </div>
                        </div>
                        <p className="font-medium text-text">{template.name}</p>
                        <p className="text-sm text-text/70 mt-1">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Answer Key */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-text">Answer Key</h2>
              </div>

              <p className="text-text/70 mb-6">
                Set the correct answers for each question. Students' responses
                will be graded against this key.
              </p>

              <div className="grid grid-cols-5 gap-4 mb-8">
                {answerKey.map((answer, index) => (
                  <div key={index} className="answer-key-item">
                    <label className="block text-sm font-medium text-text mb-2">
                      Question {index + 1}
                    </label>
                    <select
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition-all"
                    >
                      {answerOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </button>
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-secondary to-secondary/90 text-white px-8 py-3 rounded-lg font-medium hover:from-secondary/90 hover:to-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center space-x-2">
                    <span>Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-text">
                  Review & Create
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-text mb-4">
                      Test Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium">Title:</span>
                        <span className="text-text/70">{testData.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-secondary" />
                        <span className="font-medium">Subject:</span>
                        <span className="text-text/70">
                          {testData.subject || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-accent" />
                        <span className="font-medium">Class:</span>
                        <span className="text-text/70">
                          {testData.class || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Passing Score:</span>
                        <span className="text-text/70">
                          {testData.passingScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-text mb-4">
                      Answer Key Preview
                    </h3>
                    <div className="grid grid-cols-10 gap-2 text-sm">
                      {answerKey.slice(0, 20).map((answer, index) => (
                        <div key={index} className="text-center">
                          <div className="text-text/60 text-xs">
                            Q{index + 1}
                          </div>
                          <div className="font-medium text-text bg-gray-50 rounded py-1">
                            {answer}
                          </div>
                        </div>
                      ))}
                    </div>
                    {answerKey.length > 20 && (
                      <p className="text-text/60 text-sm mt-2">
                        ... and {answerKey.length - 20} more questions
                      </p>
                    )}
                  </div>
                </div>

                {testData.description && (
                  <div>
                    <h3 className="font-bold text-lg text-text mb-2">
                      Description
                    </h3>
                    <p className="text-text/70">{testData.description}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </button>
                <button
                  onClick={createTest}
                  className="bg-gradient-to-r from-accent to-accent/90 text-white px-8 py-3 rounded-lg font-medium hover:from-accent/90 hover:to-accent transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Create Test</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
