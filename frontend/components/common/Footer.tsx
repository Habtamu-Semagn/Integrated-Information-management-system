"use client";

import { Heart, Mail, PhoneIcon } from "lucide-react";
import { BiLocationPlus } from "react-icons/bi";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook, FaLongArrowAltRight, FaTwitter } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

function QuickLink({ label, sectionId }: { label: string; sectionId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    // Map labels to section IDs
    const sectionMap: Record<string, string> = {
      'Home': 'home',
      'About Us': 'about',
      'Services': 'services',
      'Projects': 'projects',
      'Contact': 'contact'
    };
    
    const id = sectionMap[label] || sectionId;
    
    // If we're on the landing page, scroll to section
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we're on auth page, redirect to landing page with hash
      router.push(`/#${id}`);
    }
  };

  return (
    <li 
      onClick={handleClick}
      className="list-none flex gap-3 text-gray-400 hover:text-green-500 tracking-wide text-sm items-center cursor-pointer transition-colors"
    >
      <FaLongArrowAltRight />
      {label}
    </li>
  );
}

export default function Footer() {
    return <div className="px-10 md:grid md:grid-cols-12 pb-20 pt-30 bg-black text-gray-400">
        <div className="grid md:grid-cols-4 gap-10 md:col-start-2 md:col-span-10 flex flex-col gap-4">

            {/* About */}
            <div className="flex flex-col gap-10">
                <p className="text-xl tracking-wide font-medium text-white">About Incubation</p>
                <p className="text-sm tracking-wide leading-loose">We are a startup incubation center empowering the next generation of founders with office space, seed funding, mentorship, and access to pitch competitions.</p>
                <p className="flex gap-4">
                    <a href="https://twitter.com/launchpadhub" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                        <FaTwitter className="w-8 h-8" />
                    </a>
                    <a href="https://facebook.com/launchpadhub" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                        <FaFacebook className="w-8 h-8" />
                    </a>
                    <a href="https://instagram.com/launchpadhub" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                        <BsInstagram className="w-8 h-8" />
                    </a>
                </p>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-10">
                <p className="text-xl tracking-wide font-medium text-white">Quick Links</p>
                <div className="flex flex-col gap-5">
                    <QuickLink label="Home" sectionId="home" />
                    <QuickLink label="About Us" sectionId="about" />
                    <QuickLink label="Services" sectionId="services" />
                    <QuickLink label="Projects" sectionId="projects" />
                    <QuickLink label="Contact" sectionId="contact" />
                </div>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-10">
                <p className="text-xl tracking-wide font-medium text-white">What We Offer</p>
                <div className="flex flex-col gap-5">
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Office Space</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Seed Funding</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Mentorship Program</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Pitch Competitions</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Investor Network</li>
                </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-10">
                <p className="text-xl tracking-wide font-medium text-white">Get In Touch</p>
                <p className="flex gap-5"><BiLocationPlus className="w-15 h-15" />Incubation Center, Bahir Dar, Ethiopia</p>
                <p className="flex gap-5"><PhoneIcon />+251 911 234 567</p>
                <p className="flex gap-5 break-all"><Mail />hello@incubation.com</p>
            </div>

        </div>

        <p className="tracking-wide md:col-start-2 md:col-span-10 text-center text-gray-400 text-sm pt-6 mt-10 flex items-center justify-center gap-1">
            Copyright &copy;2026 All rights reserved | Incubation &mdash; Empowering Founders with <Heart size={14} />
        </p>
    </div>
}