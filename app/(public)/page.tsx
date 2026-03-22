import Link from "next/link";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import HeroCarousel from "@/components/public/HeroCarousel";
import { getFeaturedCourses } from "@/lib/actions/courses";
import { getPublicStats } from "@/lib/actions/admin";
import { Shield, Eye, MapPin, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CPTEDINDIA — Crime Prevention Through Environmental Design",
  description:
    "CPTEDINDIA applies proactive CPTED methodologies for crime prevention, safety consulting, risk management, and professional certification training across India.",
};

export default async function HomePage() {
  const [featuredCourses, stats] = await Promise.all([
    getFeaturedCourses(),
    getPublicStats(),
  ]);

  const benefits = [
    {
      icon: Shield,
      title: "CPTED Audit & Certification",
      description:
        "Comprehensive on-site assessments for residential, institutional, government, and commercial spaces to identify and address safety vulnerabilities.",
    },
    {
      icon: Eye,
      title: "Natural Surveillance",
      description:
        "CPTED strategies ensure people are visible where they need to be seen — through design elements that enhance natural surveillance and territorial reinforcement.",
    },
    {
      icon: MapPin,
      title: "Environmental Design",
      description:
        "Involve us right from the building design stage to achieve a holistic safety and security design that balances cost, manpower, and infrastructure.",
    },
    {
      icon: BookOpen,
      title: "Professional Training",
      description:
        "Earn industry-recognized CPTED certifications — CCA or CCP — with customized training modules tailored to your organisation's specific needs.",
    },
  ];

  const services = [
    {
      title: "CPTED Consulting",
      description:
        "Proactive crime prevention strategies through environmental design. We assess spaces and advocate evidence-based changes to improve safety across any sector.",
      href: "/services#cpted",
    },
    {
      title: "Risk Management",
      description:
        "Structured frameworks to manage possible harmful activities tailored to your sector's unique credentials and risk appetite.",
      href: "/services#risk",
    },
    {
      title: "Security Projects",
      description:
        "End-to-end security project consulting — from planning and design to implementation and review.",
      href: "/services#security",
    },
    {
      title: "Expatriate Services",
      description:
        "Dedicated safety and security advisory services for expatriates and international organisations operating in India.",
      href: "/services#expatriate",
    },
  ];

  return (
    <div>
      {/* Scroll 1 — Hero */}
      <HeroCarousel />

      {/* Scroll 2 — What is CPTED / Why CPTEDINDIA */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CPTEDINDIA?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Technologies can be defeated. Traditional security measures are expensive and some are obsolete.
              A combination of CPTED and security devices is the perfect answer to balance present and future security risks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                  <Icon className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll 3 — Services overview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
              <p className="text-gray-500">
                From CPTED audits to risk management — we cover every dimension of safety.
              </p>
            </div>
            <Link href="/services">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                View All Services →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ title, description, href }) => (
              <Link key={title} href={href} className="group">
                <div className="bg-white rounded-xl border border-gray-200 p-6 h-full hover:shadow-md hover:border-amber-300 transition-all">
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-amber-500 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  CPTED Training Courses
                </h2>
                <p className="text-gray-500">
                  Earn industry-recognised certifications — CCA & CCP.
                </p>
              </div>
              <Link href="/courses">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
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

      {/* Scroll 4 — Stats bar */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">{stats.courses}+</p>
              <p className="text-gray-400 font-medium">CPTED Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">{stats.students}+</p>
              <p className="text-gray-400 font-medium">Trained Professionals</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">{stats.certificates}+</p>
              <p className="text-gray-400 font-medium">Certificates Issued</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Connect with us for a Free Consultation
          </h2>
          <p className="text-gray-500 mb-8">
            Whether you need a CPTED audit, risk management framework, or professional certification — we are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 shadow-lg"
              >
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-10"
              >
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
