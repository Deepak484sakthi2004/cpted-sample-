import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "CPTEDINDIA — eLearning Platform",
    template: "%s | CPTEDINDIA",
  },
  description: "Advance your career with CPTEDINDIA's expert-curated online courses. Learn Python, React, Data Science, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
