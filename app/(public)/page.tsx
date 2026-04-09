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
      title: "Our Mission",
      description:
        "CPTEDINDIA provides top-tier services, fostering a crime-free society through expertise and community engagement. Our initiatives enhance quality of life and potentially increasing property values while reducing possible crime and insurance costs.",
    },
    {
      icon: Eye,
      title: "Environmental Design",
      description:
        "India's Primary and premier institution focusing only on CPTED as a core area. CPTED strategies ensure people are visible where they need to be seen — through design elements that enhance natural surveillance and territorial reinforcement.",
    },
    {
      icon: MapPin,
      title: "Expert-Led Approach",
      description:
        "Expertise provided by Criminologist and strategist who deal with CRIME and Prevention Strategies.",
    },
    {
      icon: BookOpen,
      title: "Professional Training",
      description:
        "An ISO Certified company with reputation and backed by client's trust. Earn industry-recognized CPTED certifications — CCA or CCP — with customized training modules tailored to your organisation's specific needs.",
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
            <p className="text-gray-500 max-w-3xl mx-auto">
              CPTEDINDIA provides top-tier services, fostering a crime-free society through expertise and community engagement. Our initiatives enhance quality of life and potentially increasing property values while reducing possible crime and insurance costs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-gray-900 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                  <Icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-[15px] text-gray-300">{description}</p>
              </div>
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
