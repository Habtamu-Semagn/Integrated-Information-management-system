import { Heart, Mail, PhoneIcon } from "lucide-react";
import { BiLocationPlus } from "react-icons/bi";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook, FaLongArrowAltRight, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return <div className="px-10 md:grid md:grid-cols-12 pb-20 pt-30 bg-black text-gray-400">
        <div className="grid md:grid-cols-4 gap-10 md:col-start-2 md:col-span-10 flex flex-col gap-4">

            {/* About */}
            <div className="flex flex-col gap-10">
                <p className="text-xl tracking-wide font-medium text-white">About LaunchPad Hub</p>
                <p className="text-sm tracking-wide leading-loose">We are a startup incubation center empowering the next generation of founders with office space, seed funding, mentorship, and access to pitch competitions.</p>
                <p className="flex gap-4">
                    <FaTwitter className="w-8 h-8" />
                    <FaFacebook className="w-8 h-8" />
                    <BsInstagram className="w-8 h-8" />
                </p>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-10">
                <p className="text-xl tracking-wide font-medium text-white">Quick Links</p>
                <div className="flex flex-col gap-5">
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Home</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />About Us</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Programs</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Portfolio</li>
                    <li className="list-none flex gap-3 text-gray-400 tracking-wide text-sm items-center"><FaLongArrowAltRight />Contact</li>
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
                <p className="flex gap-5"><BiLocationPlus className="w-15 h-15" />Bole Innovation District, Addis Ababa, Ethiopia</p>
                <p className="flex gap-5"><PhoneIcon />+251 911 234 567</p>
                <p className="flex gap-5 break-all"><Mail />hello@launchpadhub.com</p>
            </div>

        </div>

        <p className="tracking-wide md:col-start-2 md:col-span-10 text-center text-gray-400 text-sm pt-6 mt-10 flex items-center justify-center gap-1">
            Copyright &copy;2026 All rights reserved | LaunchPad Hub &mdash; Empowering Founders with <Heart size={14} />
        </p>
    </div>
}