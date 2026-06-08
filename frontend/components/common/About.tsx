import Image from "next/image"
import aboutImage from "@/public/images/about.jpg"

export default function About() {
    return <div className="grid grid-cols-12">
        <div className="hidden md:block col-start-2 col-span-4 h-full relative">
            <Image src={aboutImage} alt="about-page-image" fill className="object-cover" />
        </div>
        <div className="sm:col-start-2 md:col-start-6 col-span-12 md:col-span-6 pl-7 pr-5 w-full h-full flex flex-col justify-center">
            <p className="text-sm font-semibold tracking-widest text-green-500 uppercase mb-6">welcome to launchpad hub</p>
            <p className="text-2xl md:text-4xl font-semibold text-slate-900 capitalize mb-8">we fuel the next big ideas</p>
            <div className="flex flex-col gap-5 text-gray-400 tracking-wide">
                <p>We are a dynamic startup incubation center dedicated to turning bold ideas into thriving businesses — providing the resources, mentorship, and community every founder needs to succeed.</p>
                <p>Over the years we have supported early-stage startups across diverse industries, equipping them with fully-equipped office spaces, seed funding, and access to a powerful network of investors and industry leaders.</p>
                <p>From co-working facilities and business mentorship to pitch competitions and funding opportunities, we offer a complete ecosystem designed to accelerate your startup from concept to market.</p>
            </div>
            <div className="flex flex-col w-fit md:flex-row-reverse bg-green-400 text-black p-5 sm:p-9 sm:w-80 md:w-95 md:-translate-x-30 my-10">
                <div className="flex flex-col gap-1">
                    <span className="text-xl sm:text-2xl md:text-3xl">200+</span>
                    <span className="text-md sm:text-lg md:texl-xl uppercase font-light">startups incubated</span>
                </div>
            </div>
        </div>
    </div>
}