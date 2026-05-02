import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageBanner from "@/components/public/PageBanner";
import { Target, Users, Award, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CPTEDINDIA — Our Mission & Story",
  description:
    "Learn about CPTEDINDIA — our mission in Crime Prevention Through Environmental Design, safety consulting, and professional certification.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gray-900/95 py-28 md:py-36 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About <span className="text-amber-400">CPTEDINDIA</span>
          </h1>
          <p className="text-xl text-white/80">
            Proactive crime prevention through environmental design, risk
            management, and professional certification across India.
          </p>
        </div>
      </div>

      {/* Mission — Type 3: frosted glass card over full-bleed image */}
      <PageBanner
          src="/images/team-collaboration.jpg"
        overlayClass="bg-gradient-to-r from-gray-900/92 via-gray-900/60 to-transparent"
        className="min-h-[70vh] flex items-center py-16 md:py-24 px-4"
      >
        <div className="mx-auto max-w-7xl w-full">
          <div className="md:max-w-[35%]">
            <div className="bg-blue-950/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-200 mb-4 leading-relaxed">
                CPTEDINDIA was established to bring proactive Crime Prevention
                Through Environmental Design (CPTED) methodologies to
                individuals, institutions, and government bodies across India.
              </p>
              <p className="text-gray-200 mb-4 leading-relaxed">
                We believe safety should be designed in — not bolted on.
                Technologies can be defeated; traditional security measures
                are expensive and some are obsolete. A combination of CPTED
                and security devices is the perfect answer to balance present
                and future security risks.
              </p>
              <p className="text-gray-200 leading-relaxed">
                From CPTED audits and risk frameworks to professional
                certifications (CCA &amp; CCP), we provide end-to-end safety
                solutions for every sector.
              </p>
            </div>
          </div>
        </div>
      </PageBanner>

      {/* Values */}
      <section className="py-16 px-4 bg-blue-900">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                label: "Mission-Driven",
                desc: "Clear safety outcomes in every engagement",
              },
              {
                icon: Users,
                label: "People First",
                desc: "Strategies that engage and protect communities",
              },
              {
                icon: Award,
                label: "Certified Excellence",
                desc: "Industry-recognised CCA & CCP certifications",
              },
              {
                icon: Shield,
                label: "Proactive Safety",
                desc: "Prevention by design, not reaction after the fact",
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-blue-900 rounded-xl border border-white/20 p-5 text-center hover:shadow-md transition-shadow"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/20">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <p className="font-semibold text-sm text-white mb-1">
                  {label}
                </p>
                <p className="text-xs text-gray-200">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make Your Space Safer?
          </h2>
          <p className="text-gray-300 mb-8">
            Connect with us for a free consultation or explore our CPTED
            training courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 shadow-lg"
              >
                Free Consultation
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 font-semibold px-8"
              >
                View Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
