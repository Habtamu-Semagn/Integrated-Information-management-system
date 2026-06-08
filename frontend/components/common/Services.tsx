"use client"
import { Building2, DollarSign, Users, Trophy, Lightbulb, Network, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: Building2, label: "Office Space", content: [
    "Our modern co-working facility provides startups with fully-equipped, flexible office space designed to foster collaboration, creativity, and productivity from day one.",
    "From private desks and meeting rooms to high-speed internet and event spaces, our hub gives your team everything it needs to focus on building — without worrying about infrastructure.",
  ]},
  { icon: DollarSign, label: "Seed Funding", content: [
    "We provide early-stage seed funding to accepted startups, giving founders the financial runway they need to validate their ideas, build their MVP, and attract follow-on investment.",
    "Beyond the initial grant, we connect startups with our curated network of angel investors and venture capital partners who are actively looking for the next big opportunity.",
  ]},
  { icon: Users, label: "Mentorship", content: [
    "Every startup in our program is paired with experienced mentors — seasoned entrepreneurs, industry experts, and investors — who provide hands-on guidance tailored to your specific challenges.",
    "Through regular one-on-one sessions, group workshops, and expert-led masterclasses, our mentorship program equips founders with the skills and mindset needed to scale their business.",
  ]},
  { icon: Trophy, label: "Pitch Competitions", content: [
    "We host regular pitch competitions that give startups the platform to present their ideas to investors, corporates, and media — creating real opportunities for funding and partnerships.",
    "Our competitions are structured to challenge founders to sharpen their storytelling, financials, and go-to-market strategy, ensuring they are truly investor-ready when it counts most.",
  ]},
  { icon: Lightbulb, label: "Innovation Labs", content: [
    "Our innovation labs provide startups with access to cutting-edge tools, prototyping equipment, and technical resources to experiment, iterate, and bring their product ideas to life faster.",
    "Working alongside like-minded founders and engineers in the lab environment accelerates problem-solving and sparks the kind of cross-industry collaboration that leads to breakthrough solutions.",
  ]},
  { icon: Network, label: "Investor Network", content: [
    "Gain direct access to our growing network of local and international investors who are committed to backing high-potential startups emerging from our incubation program.",
    "We facilitate warm introductions, organize investor demo days, and coach founders on how to build lasting relationships with the right financial partners for their growth stage.",
  ]},
  { icon: BookOpen, label: "Training & Workshops", content: [
    "Our structured training curriculum covers everything from lean startup methodology and product development to financial modeling, legal compliance, and marketing strategy.",
    "Weekly workshops, boot camps, and guest speaker sessions ensure that every founder leaves the program not just with a funded idea, but with the knowledge to run a sustainable business.",
  ]},
];

const serviceItems = [
  {
    title: "Business Mentorship",
    content: "Get paired with industry experts who guide your startup at every stage."
  },
  {
    title: "Funding Access",
    content: "Connect with seed investors and grant opportunities to fuel your growth."
  },
  {
    title: "Pitch Preparation",
    content: "Sharpen your pitch and get investor-ready with dedicated coaching."
  },
  {
    title: "24/7 Hub Access",
    content: "Work on your own schedule with round-the-clock access to our facility."
  },
]

export default function Services() {
  const [activeItem, setActiveItem] = useState(menuItems[0].label)
  const activeMenuItem = menuItems.find((item) => item.label === activeItem)

  return (
    <div>
      <div className="grid grid-cols-12 bg-gray-50">
        <div className="col-start-2 col-span-10 md:col-start-2 md:col-span-3 bg-[#42E47A] md:min-h-screen flex flex-col px-8 py-10 gap-2 relative">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`relative flex items-center gap-4 py-3 px-2 rounded-lg cursor-pointer hover:font-bold transition-colors ${
                item.label === activeItem ? "font-bold text-white" : "text-green-100"
              }`}
            >
              <item.icon className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-lg">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="col-start-2 col-span-10 pl-8 py-12 md:col-start-6 md:col-span-5 flex items-center justify-center">
          {activeMenuItem && (
            <div className="flex flex-col gap-6 max-w-lg">
              <div>
                <activeMenuItem.icon style={{ color: "#7ac64d" }} className="w-26 h-26 text-green-500" strokeWidth={1} />
              </div>
              <h2 className="text-4xl text-gray-800 tracking-tight">
                {activeMenuItem.label}
              </h2>
              <div className="flex flex-col gap-4">
                {activeMenuItem.content.map((item) => (
                  <p key={item} className="text-gray-500 text-base leading-relaxed">{item}</p>
                ))}
              </div>
              <button style={{ background: 'linear-gradient(to right, #7ac64d, #31de79)' }} className="border-green-500 w-fit px-8 py-3 hover:bg-green-600 text-white text-sm font-medium rounded-full transition-colors duration-200">
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 bg-[url('/images/service_section_image.jpg')] bg-cover bg-center bg-no-repeat">
        {serviceItems.map((item) => (
          <div key={item.title} className="group col-start-2 sm:col-start-4 md:col-start-7 col-span-11 md:col-span-6 bg-white mt-1 flex py-7 opacity-90 transition-transform duration-500 cursor-pointer hover:-translate-x-10 sm:hover:-translate-x-20">
            <p className="px-5 h-full flex items-center justify-center">
              <ChevronRight className="text-green-500 group-hover:hidden" />
              <ChevronLeft className="text-green-500 hidden group-hover:block" />
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-green-500 text-xl tracking-wide">{item.title}</p>
              <p className="text-md">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}