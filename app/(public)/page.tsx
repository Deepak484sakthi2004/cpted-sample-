import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/components/CourseCard";
import { getFeaturedCourses } from "@/lib/actions/courses";
import { getPublicStats } from "@/lib/actions/admin";
import { formatCurrency, getLevelColor } from "@/lib/utils";
import { BookOpen, Award, Users, CheckCircle, Star, Zap } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CPTEDINDIA — Advance Your Career with Expert-Curated Courses",
  description: "Learn Python, React, Data Science, and more with CPTEDINDIA's structured online courses. Earn verified certificates.",
};

export default async function HomePage() {
  const [featuredCourses, stats] = await Promise.all([
    getFeaturedCourses(),
    getPublicStats(),
  ]);

  const benefits = [
    {
      icon: BookOpen,
      title: "Structured Learning Paths",
      description: "Carefully sequenced modules take you from beginner to proficient with no gaps in knowledge.",
    },
    {
      icon: CheckCircle,
      title: "Module Quizzes",
      description: "Test your understanding after each module with targeted quizzes and immediate feedback.",
    },
    {
      icon: Award,
      title: "Verified Certificates",
      description: "Earn a downloadable certificate when you complete a course — ready to share with employers.",
    },
    {
      icon: Star,
      title: "Expert-Curated Content",
      description: "All courses are crafted by industry professionals with real-world experience.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Advance Your Career with{" "}
            <span className="text-blue-200">CPTEDINDIA</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Expert-curated online courses designed to help you master in-demand skills, earn verified certificates, and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-semibold px-8">
                Browse Courses
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 font-semibold px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why CPTEDINDIA */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CPTEDINDIA?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to learn effectively and advance your career.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
                <p className="text-gray-500">Our most popular and highly rated courses.</p>
              </div>
              <Link href="/courses">
                <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                  View All Courses →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  shortDescription={course.shortDescription}
                  thumbnail={course.thumbnail}
                  level={course.level}
                  price={course.price}
                  slug={course.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats bar */}
      <section className="py-16 px-4 bg-blue-800 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">{stats.courses}+</p>
              <p className="text-blue-200 font-medium">Published Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">{stats.students}+</p>
              <p className="text-blue-200 font-medium">Registered Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">{stats.certificates}+</p>
              <p className="text-blue-200 font-medium">Certificates Issued</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-500 mb-8">Join thousands of students already advancing their careers with CPTEDINDIA.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800 font-semibold px-10">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
