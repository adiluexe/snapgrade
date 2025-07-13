import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 group"
              >
                <Zap className="w-5 h-5 text-text group-hover:text-primary transition-colors duration-300 group-hover:rotate-12 transform" />
                <span className="text-xl font-bold font-heading text-text group-hover:text-primary transition-colors duration-300">
                  SnapGrade
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-text hover:text-primary transition-all duration-300 relative group font-heading flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
