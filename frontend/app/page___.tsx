"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Rocket, Users, TrendingUp, CheckCircle, Building2, Lightbulb, Target } from "lucide-react";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-700" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Incubation Center</h1>
              <p className="text-xs text-gray-600">Supporting Startups from the Ground Up</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-sm font-medium text-gray-700 hover:text-blue-700 transition cursor-pointer">About</a>
            <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-sm font-medium text-gray-700 hover:text-blue-700 transition cursor-pointer">Services</a>
            <a href="#benefits" onClick={(e) => scrollToSection(e, "benefits")} className="text-sm font-medium text-gray-700 hover:text-blue-700 transition cursor-pointer">Benefits</a>
            <a href="#process" onClick={(e) => scrollToSection(e, "process")} className="text-sm font-medium text-gray-700 hover:text-blue-700 transition cursor-pointer">Process</a>
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Apply Now</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-3 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Government-Backed Startup Support
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Startup Vision Into Reality
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The Incubation Center provides comprehensive support, funding, and mentorship to help entrepreneurs build successful businesses from the ground up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-lg px-8">
                  Start Your Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#about" onClick={(e) => scrollToSection(e, "about")}>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">500+</div>
              <div className="text-gray-600">Startups Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">$50M+</div>
              <div className="text-gray-600">Funding Provided</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-700 mb-2">200+</div>
              <div className="text-gray-600">Expert Mentors</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About the Incubation Center
            </h2>
            <p className="text-lg text-gray-600">
              A government initiative dedicated to fostering innovation and entrepreneurship by providing startups with the resources, guidance, and support they need to succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Lightbulb className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
              <p className="text-gray-600">
                We support groundbreaking ideas that have the potential to transform industries and create lasting impact.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Mentorship</h3>
              <p className="text-gray-600">
                Access to experienced entrepreneurs, industry leaders, and domain experts who guide you every step of the way.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Target className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Focused Support</h3>
              <p className="text-gray-600">
                Tailored programs designed to address your specific needs and accelerate your growth trajectory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive support services designed to help your startup thrive
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Seed Funding", desc: "Financial support to kickstart your venture" },
              { title: "Office Space", desc: "Modern co-working spaces and facilities" },
              { title: "Mentorship Programs", desc: "One-on-one guidance from industry experts" },
              { title: "Legal Support", desc: "Assistance with compliance and regulations" },
              { title: "Networking Events", desc: "Connect with investors and partners" },
              { title: "Technical Resources", desc: "Access to tools and infrastructure" }
            ].map((service, idx) => (
              <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition">
                <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-blue-200">
              Join a thriving ecosystem of innovators and entrepreneurs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <TrendingUp className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Accelerated Growth</h3>
                <p className="text-blue-200">Fast-track your startup journey with our proven methodologies and resources.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Strong Network</h3>
                <p className="text-blue-200">Connect with fellow entrepreneurs, investors, and industry leaders.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Building2 className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Government Backing</h3>
                <p className="text-blue-200">Benefit from credibility and support of a government initiative.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Rocket className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Market Access</h3>
                <p className="text-blue-200">Get help entering markets and scaling your business effectively.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application Process
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to join our incubation program
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { step: "1", title: "Submit Application", desc: "Fill out our online application form with your startup details and business plan." },
                { step: "2", title: "Initial Review", desc: "Our team reviews your application and assesses your startup's potential." },
                { step: "3", title: "Interview", desc: "Selected candidates are invited for an interview with our evaluation panel." },
                { step: "4", title: "Onboarding", desc: "Approved startups join our program and begin their incubation journey." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join hundreds of successful startups that have transformed their ideas into thriving businesses with our support.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-lg px-8">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-blue-500" />
                <span className="font-bold text-white">Incubation Center</span>
              </div>
              <p className="text-sm">
                Supporting startups from the ground up with comprehensive resources and expert guidance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" onClick={(e) => scrollToSection(e, "about")} className="hover:text-blue-500 transition cursor-pointer">About Us</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-blue-500 transition cursor-pointer">Services</a></li>
                <li><a href="#benefits" onClick={(e) => scrollToSection(e, "benefits")} className="hover:text-blue-500 transition cursor-pointer">Benefits</a></li>
                <li><a href="#process" onClick={(e) => scrollToSection(e, "process")} className="hover:text-blue-500 transition cursor-pointer">Process</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Guidelines</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Success Stories</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: info@incubationcenter.gov</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: Government Complex, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Incubation Center. All rights reserved. A Government Initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
