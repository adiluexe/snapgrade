import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SnapGrade - AI-Powered Bubble Sheet Grader",
    template: "%s | SnapGrade",
  },
  description:
    "Revolutionary AI-powered bubble sheet scanner and grader for educators. Scan, grade, and analyze student tests in seconds with 99.8% accuracy. Save time and improve your grading workflow.",
  keywords: [
    "bubble sheet grader",
    "AI grading",
    "automated grading",
    "education technology",
    "test grading",
    "bubble sheet scanner",
    "teacher tools",
    "assessment technology",
    "educational software",
    "SnapGrade",
  ],
  authors: [{ name: "SnapGrade Team" }],
  creator: "SnapGrade",
  publisher: "SnapGrade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://snapgrade.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SnapGrade - AI-Powered Bubble Sheet Grader",
    description:
      "Revolutionary AI-powered bubble sheet scanner and grader for educators. Scan, grade, and analyze student tests in seconds with 99.8% accuracy.",
    url: "https://snapgrade.com",
    siteName: "SnapGrade",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapGrade - AI-Powered Bubble Sheet Grader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapGrade - AI-Powered Bubble Sheet Grader",
    description:
      "Revolutionary AI-powered bubble sheet scanner and grader for educators. Save time with instant grading and analytics.",
    images: ["/twitter-image.png"],
    creator: "@snapgrade",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {" "}
      <head>
        {/* Theme Color */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="SnapGrade" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SnapGrade" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SnapGrade",
              description: "AI-powered bubble sheet grader for educators",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "SnapGrade",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
