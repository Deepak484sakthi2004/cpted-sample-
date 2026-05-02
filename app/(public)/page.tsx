import Link from "next/link";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import HeroCarousel from "@/components/public/HeroCarousel";
import { getFeaturedCourses } from "@/lib/actions/courses";
import { Shield, Eye, MapPin, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CPTEDINDIA — Crime Prevention Through Environmental Design",
  description:
    "CPTEDINDIA applies proactive CPTED methodologies for crime prevention, safety consulting, risk management, and professional certification training across India.",
};

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses();

  const benefits = [
    {
      icon: Shield,
      title: "OUR MISSION",
      description:
        "Empowering professionals and learners to design security and Safety\n\nTo support the students and the next generation enthusiasts in crime Prevention and Environmental design",
    },
    {
      icon: Eye,
      title: "Environmental Design",
      description:
        "CPTED strategies ensure people are visible where they need to be seen — through design elements that enhance natural surveillance and territorial reinforcement.",
    },
    {
      icon: MapPin,
      title: "CPTED Audit & Certification",
      description:
        "Comprehensive on-site assessments for residential, institutional, government, and commercial spaces to identify and address safety vulnerabilities.",
    },
    {
      icon: BookOpen,
      title: "Professional Training",
      description:
        "Earn industry-recognized CPTED certifications — CCA or CCP — with customized training modules tailored to your organisation's specific needs.",
    },
  ];

  return (
    <div>
      {/* Scroll 1 — Hero */}
      <HeroCarousel />

      {/* Scroll 2 — What is CPTED / Why CPTEDINDIA */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Why Choose CPTEDINDIA?
            </h2>
            <div className="text-gray-500 max-w-3xl mx-auto space-y-3 text-left">
              <p>
                CPTEDINDIA provides top-tier services, fostering a crime-free society through expertise and community engagement. Our initiatives enhance quality of life and potentially increasing property values while reducing possible crime and insurance costs.
              </p>
              <p>India&apos;s Primary and premier institution focusing only on CPTED as a core area.</p>
              <p>Expertise provided by Criminologist and strategist who deal with CRIME and Prevention Strategies.</p>
              <p>An ISO Certified company with reputation and backed by client&apos;s trust.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-gray-900 rounded-xl p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                  <Icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="font-bold text-white text-xl mb-2">{title}</h3>
                <p className="text-base text-gray-300 whitespace-pre-line">{description}</p>
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
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Our Services</h2>
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
            {[
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
            ].map(({ title, description, href }) => (
              <Link key={title} href={href} className="group">
                <div className="bg-gray-900 rounded-xl p-6 h-full hover:shadow-md hover:border-amber-300 transition-all">
                  <h3 className="font-bold text-white text-lg mb-3 group-hover:text-amber-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-base text-gray-300">{description}</p>
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
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
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
              <p className="text-4xl font-bold mb-2">7+</p>
              <p className="text-gray-400 font-medium">Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">20+</p>
              <p className="text-gray-400 font-medium">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100+</p>
              <p className="text-gray-400 font-medium">Trained</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4 bg-gray-900 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect with us for a Free Consultation
          </h2>
          <p className="text-gray-300 mb-6">
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
                className="border-white text-white hover:bg-white/10 font-semibold px-10"
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
