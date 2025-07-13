"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { templateConfigs } from "@/lib/bubblesheet";

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

  // Convert templateConfigs to the format expected by the component
  const templates = Object.entries(templateConfigs).map(([key, config]) => ({
    id: key,
    name: config.name,
    questions: parseInt(key),
    description: config.description,
  }));

  const answerOptions = ["A", "B", "C", "D", "E"];

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTestData({
        ...testData,
        template: templateId,
        totalQuestions: template.questions,
      });
      // Reset answer key when template changes
      setAnswerKey(new Array(template.questions).fill("A"));
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswerKey = [...answerKey];
    newAnswerKey[questionIndex] = answer;
    setAnswerKey(newAnswerKey);
  };

  const generateAnswerKey = () => {
    // Generate random answer key for demo purposes
    const randomAnswers = Array.from(
      { length: testData.totalQuestions },
      () => answerOptions[Math.floor(Math.random() * 4)] // Only A, B, C, D for demo
    );
    setAnswerKey(randomAnswers);
  };

  const handleCreateTest = () => {
    setError("");

    // Validation
    if (!testData.title.trim()) {
      setError("Please enter a test title");
      return;
    }

    if (answerKey.length !== testData.totalQuestions) {
      setError("Please set answers for all questions");
      return;
    }

    // Save test to localStorage
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                <span className="text-xl font-bold text-text">SnapGrade</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-text hover:text-primary transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center ${
                currentStep >= 1 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Test Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div
              className={`flex items-center ${
                currentStep >= 2 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Answer Key</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div
              className={`flex items-center ${
                currentStep >= 3 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Step 1: Test Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-text mb-6">
              Create New Test
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Test Title *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="e.g., Math Quiz Chapter 5"
                  value={testData.title}
                  onChange={(e) =>
                    setTestData({ ...testData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Optional description of the test"
                  value={testData.description}
                  onChange={(e) =>
                    setTestData({ ...testData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., Mathematics"
                    value={testData.subject}
                    onChange={(e) =>
                      setTestData({ ...testData, subject: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Class/Grade
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., Grade 8"
                    value={testData.class}
                    onChange={(e) =>
                      setTestData({ ...testData, class: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-4">
                  Bubble Sheet Template *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        testData.template === template.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <h3 className="font-bold text-text text-sm">
                        {template.name}
                      </h3>
                      <p className="text-xs text-text/70 mt-1">
                        {template.description}
                      </p>
                      <p className="text-xs text-primary mt-1">
                        {template.questions} questions
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={nextStep}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Next: Set Answer Key →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Answer Key */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-text">Set Answer Key</h1>
              <button
                onClick={generateAnswerKey}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-all text-sm"
              >
                Generate Random (Demo)
              </button>
            </div>

            <p className="text-text/70 mb-6">
              Set the correct answer for each question. You can modify these
              later if needed.
            </p>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-8">
              {Array.from({ length: testData.totalQuestions }, (_, index) => (
                <div key={index} className="text-center">
                  <label className="block text-sm font-medium text-text mb-2">
                    Q{index + 1}
                  </label>
                  <select
                    className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary text-center"
                    value={answerKey[index] || "A"}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    {answerOptions.slice(0, 4).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="border border-gray-300 text-text px-6 py-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-text mb-6">Review Test</h1>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-text mb-2">Test Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Title:</span>{" "}
                      {testData.title}
                    </p>
                    <p>
                      <span className="font-medium">Template:</span>{" "}
                      {testData.totalQuestions} questions
                    </p>
                    <p>
                      <span className="font-medium">Subject:</span>{" "}
                      {testData.subject || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Class:</span>{" "}
                      {testData.class || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Passing Score:</span>{" "}
                      {testData.passingScore}%
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-2">
                    Answer Key Preview
                  </h3>
                  <div className="text-sm text-text/70">
                    <p>First 10 answers: {answerKey.slice(0, 10).join(", ")}</p>
                    <p className="mt-1">Total questions: {answerKey.length}</p>
                  </div>
                </div>
              </div>

              {testData.description && (
                <div>
                  <h3 className="font-bold text-text mb-2">Description</h3>
                  <p className="text-text/70">{testData.description}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="border border-gray-300 text-text px-6 py-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleCreateTest}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Create Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
