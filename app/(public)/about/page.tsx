import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Users, Award, TrendingUp, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CPTEDINDIA — Our Mission & Story",
  description: "Learn about CPTEDINDIA — our mission to make quality professional education accessible to every Indian learner.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About CPTEDINDIA</h1>
          <p className="text-xl text-blue-100">
            Empowering India's workforce through structured, expert-led online education.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                CPTEDINDIA — the Centre for Professional Training & Education in India — was founded with a single purpose: to bridge the gap between India's growing workforce and the skills required to thrive in the modern economy.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that quality education should not be limited by geography, financial barriers, or access to traditional institutions. Our platform brings expert-curated courses directly to you, wherever you are in India.
              </p>
              <p className="text-gray-600">
                From programming and data science to business communication and digital marketing, our courses are designed by industry professionals who know what employers are looking for.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Mission-Driven", desc: "Clear learning objectives in every course" },
                { icon: Users, label: "Community First", desc: "A growing network of 1000+ learners" },
                { icon: Award, label: "Verified Learning", desc: "Certificates that employers trust" },
                { icon: TrendingUp, label: "Career Focused", desc: "Skills that lead to real job growth" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-blue-50 rounded-xl p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 mb-3">
                    <Icon className="h-5 w-5 text-blue-700" />
                  </div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Programming & Technology", desc: "Python, Web Development, React, Data Science, Machine Learning, and more — the most in-demand tech skills." },
              { icon: Globe, title: "Business & Professional Skills", desc: "Communication, project management, digital marketing, and other skills for career advancement." },
              { icon: Award, title: "Verified Certificates", desc: "Upon completion, download a professional certificate with a unique number you can verify and share with employers." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
                  <Icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-800 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey</h2>
          <p className="text-blue-100 mb-8">Browse our full catalogue of courses and find the one that takes your career to the next level.</p>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-semibold px-8">
              Browse Courses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
