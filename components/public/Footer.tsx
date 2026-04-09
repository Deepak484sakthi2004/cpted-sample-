import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-ci.jpg"
                alt="CPTEDINDIA"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400">
              Proactive crime prevention through environmental design, risk management, and professional certification across India.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-amber-400 transition-colors">About</Link></li>
              <li><Link href="/services" className="text-sm hover:text-amber-400 transition-colors">Services</Link></li>
              <li><Link href="/courses" className="text-sm hover:text-amber-400 transition-colors">Courses</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-sm hover:text-amber-400 transition-colors">Log In</Link></li>
              <li><Link href="/auth/signup" className="text-sm hover:text-amber-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:office@cptedindia.com" className="hover:text-amber-400 transition-colors">office@cptedindia.com</a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>9886333979 / 9884913382</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CPTEDINDIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
