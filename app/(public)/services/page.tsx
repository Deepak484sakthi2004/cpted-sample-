import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PageBanner from "@/components/public/PageBanner";
import {
  Shield,
  AlertTriangle,
  Lock,
  Globe,
  BookOpen,
  CheckCircle,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — CPTEDINDIA",
  description:
    "CPTEDINDIA offers CPTED consulting, risk management, security project advisory, expatriate services, and professional CPTED certification training.",
};

const whoRequires = [
  "Individual Residences",
  "Government Buildings",
  "Railway Stations & Bus Terminals",
  "Airports & Harbours",
  "Libraries & Public Parks",
  "Public Parking Spaces",
  "Warehouses & Factories",
  "Educational Campuses",
  "Hospitality Sectors",
  "Hospitals",
  "Business Parks",
  "Entertainment Avenues",
  "Industrial Warehouses",
  "Data Centres",
  "Developmental Projects",
];

const genericModuleTopics = [
  "Introduction to Concepts",
  "CPTED and Historical Reference",
  "CPTED and Theory",
  "Practicals — Case Study Engagement 1",
  "CPTED and Relevant Standards",
  "CPTED Generations",
  "Practicals — Case Study Engagement 2",
  "CPTED Principals",
  "CPTED and Corporates",
  "Practicals — CPTED Individual Project Engagement",
  "Practicals — CPTED Group Project Engagement",
  "Evaluation and Certificate Distribution",
];

const ccaAdditional = [
  "CPTED in Educational Institutions",
  "CPTED in Business Parks",
  "CPTED in a Corporate Premises",
  "CPTED and Urban Planning",
  "Creating CPTED Design",
  "CPTED Drawings for Presentation",
];

const expatriateServices = [
  "Property Management",
  "Hotel Audits",
  "Expat housing assessment",
  "Travel and Transport Safety",
  "Transit management",
  "Security installations",
  "Travel and tourism",
];

const ccpAdditional = [
  "CPTED and Green Buildings",
  "CPTED and Data Centres",
  "CPTED and Communication",
  "CPTED and ROI — Return on Investment",
  "CPTED and Future",
];

export default function ServicesPage() {
  return (
    <div>
      {/* Page Header */}
      <PageBanner
        src="/images/iStock-3.jpg"
        overlayClass="bg-black/35"
        className="py-12 md:py-16 px-4 text-center"
      >
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">
            Our <span className="text-amber-400">Services</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg">
            Proactive safety and security solutions — from environmental design to professional certification.
          </p>
        </div>
      </PageBanner>

      {/* Quick Nav */}
      <nav className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 overflow-x-auto">
          <div className="flex gap-4 md:gap-8 py-3 md:py-4 whitespace-nowrap text-base md:text-lg font-semibold">
            {[
              { label: "CPTED Consulting", href: "#cpted" },
              { label: "Risk Management", href: "#risk" },
              { label: "Security Projects", href: "#security" },
              { label: "Expatriate Services", href: "#expatriate" },
              { label: "CPTED Training", href: "#training" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-gray-600 hover:text-amber-600 transition-colors flex-shrink-0 px-1"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── CONSULTING: CPTED ── */}
      <div id="cpted" className="scroll-mt-36">
        <PageBanner
          src="/images/consulting-workspace.jpg"
          overlayClass="bg-black/30"
          className="py-10 md:py-16 px-4"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-amber-500/20">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-amber-400 uppercase tracking-wide">
                Consulting
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">CPTED</h2>

            <div className="grid md:grid-cols-2 gap-6 md:gap-12">
              <div className="space-y-4 text-gray-200 text-sm md:text-base">
                <p>
                  Technologies can be defeated and sometimes the effects are recorded at a larger scale.
                  Traditional security measures are expensive and some are obsolete in recent times.
                  To ensure maximum safe progress, a combination of measures is required at this hour.
                  <strong className="text-white"> CPTED &amp; Security devices are the perfect answer</strong> to
                  balance now &amp; the future security risks.
                </p>
                <p>
                  Crime Prevention Through Environmental Design (CPTED) strategies engage the people, ensure
                  natural surveillance, inform territorial impacts, communicate ownership and the design elements
                  facilitate us to see people where they have to be seen.
                </p>
                <p>
                  CPTEDINDIA applies proactive methodologies and CPTED concepts to implement crime prevention
                  strategies. Involve us right from the building design/discussion stage to get a holistic
                  safety and security design.
                </p>
                <Link href="/contact">
                  <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold mt-2 shadow-md w-full sm:w-auto">
                    Connect for a Free Consultation
                  </Button>
                </Link>
              </div>

              <div className="space-y-4 md:space-y-6">
                {/* Who requires */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 md:p-6">
                  <h3 className="font-bold text-white mb-3 md:mb-4 text-sm md:text-base">Who Requires a CPTED Audit and Certification?</h3>
                  <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
                    Any space utilised by an individual or people — or where there is a presence of property and
                    process — requires a CPTED Audit and Certification. In specific:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {whoRequires.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs md:text-sm text-gray-200">
                        <ChevronRight className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How we do it */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 md:p-6">
                  <h3 className="font-bold text-white mb-3 md:mb-4 text-sm md:text-base">How We Do It</h3>
                  <ol className="space-y-2 text-xs md:text-sm text-gray-200 list-none">
                    {[
                      "Engage in dialogue to understand the client requirement",
                      "Conduct a structured, comprehensive on-site assessment",
                      "Provide raw data to clients to understand on-ground realities",
                      "Execute pre and post surveys to measure progress",
                      "Present findings of assessments, surveys, and data modelling",
                      "Advocate evidence-based suggestions for effective change",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs md:text-sm text-gray-300 mt-4">
                    Based on the final findings, CPTEDINDIA will advocate suggestions for effective change and
                    progress in cost, manpower, infrastructure, and business engagements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageBanner>
      </div>

      {/* ── CONSULTING: RISK MANAGEMENT ── */}
      <div id="risk" className="scroll-mt-36">
        <PageBanner
          src="/images/risk-assessment-hero.jpg"
          overlayClass="bg-gradient-to-r from-gray-900/85 to-gray-800/75"
          className="py-10 md:py-16 px-4 min-h-screen flex flex-col justify-center"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-white/15">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-orange-400 uppercase tracking-wide">
                Consulting
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Risk Management</h2>
            <div className="max-w-2xl space-y-4 text-sm md:text-base text-gray-200">
              <p>
                CPTEDINDIA will progress with a structured way of managing possible activities that could cause
                harm. Every sector is unique with their credentials and risk appetite — and so are the challenges.
              </p>
              <p>
                Contact us to address challenges in your organisation and experience peace of mind. Our experts
                can guide you to form an effective risk management framework for your firm.
              </p>
              <Link href="/contact">
                <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold mt-2 shadow-md w-full sm:w-auto">
                  Talk to Our Experts
                </Button>
              </Link>
            </div>
          </div>
        </PageBanner>
      </div>

      {/* ── CONSULTING: SECURITY PROJECTS ── */}
      <div id="security" className="scroll-mt-36">
        <PageBanner
          src="/images/security_mgmt.jpg"
          overlayClass="bg-black/20"
          className="py-10 md:py-16 px-4 min-h-screen flex flex-col justify-center"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-white/15">
                <Lock className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-amber-400 uppercase tracking-wide">
                Consulting
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Security Projects</h2>
            <div className="max-w-2xl space-y-4 text-sm md:text-base text-gray-200">
              <p>
                CPTEDINDIA provides end-to-end advisory for security projects — from initial planning and
                design through to implementation and review. We work with organisations to ensure security
                infrastructure is effective, cost-efficient, and aligned with CPTED principles.
              </p>
              <Link href="/contact">
                <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold mt-2 shadow-md w-full sm:w-auto">
                  Enquire About a Project
                </Button>
              </Link>
            </div>
          </div>
        </PageBanner>
      </div>

      {/* ── CONSULTING: EXPATRIATE ── Full image + right services box */}
      <div id="expatriate" className="scroll-mt-36 relative overflow-hidden min-h-screen">
        <Image
          src="/images/expatriate-travel.jpg"
          alt="Expatriate Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative min-h-screen flex flex-col px-4 py-10 md:py-12">
          <div className="mx-auto max-w-7xl w-full flex flex-col flex-1">

            {/* Section header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-white/15">
                <Globe className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-green-400 uppercase tracking-wide">
                Consulting
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Expatriate Services</h2>

            {/* Services box — full width on mobile, right-anchored on desktop */}
            <div className="flex justify-center md:justify-end flex-1 items-center">
              <div className="bg-white rounded-lg shadow-2xl p-5 md:p-8 w-full max-w-sm md:w-80">
                <ul className="space-y-0">
                  {expatriateServices.map((service) => (
                    <li
                      key={service}
                      className="py-2.5 md:py-3 border-b border-gray-100 last:border-0 text-gray-800 font-medium text-sm md:text-base"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom caption + CTA */}
            <div className="mt-auto pt-8 md:pt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <p className="text-xs md:text-sm text-white/90 max-w-md drop-shadow">
                CPTEDINDIA coordinates with Corporates and Individuals to provide a safer environment
                for the Expat community.{" "}
                <Link href="/contact" className="text-amber-400 hover:underline font-semibold">
                  Read More
                </Link>
              </p>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-md w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── TRAINING: CPTED ── */}
      <div id="training" className="scroll-mt-36">
        <PageBanner
          src="/images/certification-hero.jpg"
          overlayClass="bg-black/30"
          className="py-10 md:py-16 px-4"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-amber-500/20">
                <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-amber-400 uppercase tracking-wide">
                Training
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">CPTED Certification Training</h2>

            <div className="grid md:grid-cols-2 gap-6 md:gap-12">
              <div className="space-y-4 text-sm md:text-base text-gray-200">
                <p>
                  Professional certifications are a medium to convey expertise and industry knowledge that would
                  boost business and attract customers in the respective domain. Industry-relevant certifications
                  aid in revenue generation and gain a competitive edge over market competitors and leaders.
                </p>
                <p>
                  A <strong className="text-white">CPTEDINDIA certification</strong> provides you with
                  Professional credibility, Respect among peers, Subject matter expertise, and increased
                  visibility with personal branding.
                </p>
                <p className="font-medium text-white">
                  Customised Training Modules to fit your Needs.
                </p>
                <p>
                  We will discuss with you the specific needs required for your company/organisation. With the
                  outcome of the discussion, we will provide a tailor-made training solution that will address
                  the need and add value for the organisation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm md:text-base">Who Should Attend</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-300">
                    Any individual or organisation who qualifies the criteria and is determined to prevent crime,
                    learn environmental design, create value, or seek CPTED knowledge can attend the training.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm md:text-base">Certification</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-300">
                    The coveted CPTED Training Certificate will be provided on successful completion of the training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageBanner>

        {/* Course tier cards */}
        <section className="py-10 md:py-16 px-4 bg-white">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 md:mb-10">Choose Your Certification Path</h3>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">

              {/* Tier 1 — Generic One-Day */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Entry Level
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Generic One-Day Training Module</h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Requirements</p>
                  <p className="text-sm text-gray-500">
                    Open to all. English knowledge to read, write, and speak is preferred.
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Module Topics</p>
                  <ul className="space-y-1">
                    {genericModuleTopics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className="mt-6">
                  <Button variant="outline" className="w-full border-gray-300 text-amber-600 hover:bg-amber-50">
                    Enquire
                  </Button>
                </Link>
              </div>

              {/* Tier 2 — CCA */}
              <div className="bg-white rounded-xl border-2 border-amber-500 p-5 md:p-6 flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CCA
                  </span>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    For Beginners
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    CPTEDINDIA Certified CPTED Associate
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Requirements</p>
                  <p className="text-sm text-gray-500">
                    Minimum one year of experience in Crime, Risk, Safety, Security, Facilities, or Environment
                    related areas. Veterans and students (studying Criminology, Architecture, or Law) are
                    exempted. English proficiency required.
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-2">All Generic Module Topics, plus:</p>
                  <ul className="space-y-1">
                    {ccaAdditional.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">
                    Course Test &amp; Evaluation — examination at the end of the course to demonstrate knowledge
                    and understanding over all course modules.
                  </p>
                </div>
                <Link href="/courses" className="mt-6">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold">
                    View Course
                  </Button>
                </Link>
              </div>

              {/* Tier 3 — CCP */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    For Professionals — CCP
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    CPTEDINDIA Certified CPTED Professional
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Requirements</p>
                  <p className="text-sm text-gray-500">
                    Minimum three years&apos; experience in Crime, Risk, Safety, Security, Facilities, or Environment
                    related studies. Veterans and students (studying Criminology, Architecture, or Law) are
                    exempted. English proficiency required.
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    All Generic + CCA Module Topics, plus:
                  </p>
                  <ul className="space-y-1">
                    {ccpAdditional.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">
                    Course Test &amp; Evaluation — examination at the end of the course to demonstrate knowledge
                    and understanding over all course modules.
                  </p>
                </div>
                <Link href="/courses" className="mt-6">
                  <Button variant="outline" className="w-full border-gray-300 text-amber-600 hover:bg-amber-50">
                    View Course
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="py-12 md:py-16 px-4 bg-gray-900 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 text-sm md:text-base">
            Connect with us for a free consultation or enrol in a CPTED training course today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 shadow-lg w-full sm:w-auto">
                Free Consultation
              </Button>
            </Link>
            <Link href="/courses" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 w-full sm:w-auto"
              >
                View Training Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
