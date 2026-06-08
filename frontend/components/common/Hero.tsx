"use client"
import Image from "next/image";
import heroImage from "@/public/images/hero_img.jpg"
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";

function ListItem({item, activeItem, setActiveItem}:{item: string, activeItem: string, setActiveItem: React.Dispatch<React.SetStateAction<string>>}) {
  const isActive = item === activeItem;

  const handleClick = () => {
    setActiveItem(item);
    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <li 
      onClick={handleClick} 
      className={`relative cursor-pointer after:absolute after:bottom-[-4px] after:h-[2px] after:bg-green-500 after:transition-all after:duration-300
        ${isActive 
          ? 'text-green-500 after:w-full after:left-0' 
          : 'after:w-0 after:left-1/2 hover:after:w-full hover:after:left-0'
        }`}
    >
      {item}
    </li>
  )
}

function MobileListItem({item, activeItem, setActiveItem, setOpen}: {
  item: string, 
  activeItem: string, 
  setActiveItem: React.Dispatch<React.SetStateAction<string>>, 
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const isActive = item === activeItem;

  const handleClick = () => {
    setActiveItem(item);
    setOpen(false);
    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <li 
      onClick={handleClick} 
      className={`cursor-pointer text-lg py-2 w-full text-center tracking-wide border-b border-gray-100
        ${isActive ? 'text-green-500 font-medium' : 'text-gray-600'}`}
    >
      {item}
    </li>
  )
}

const listItems = ['Home', 'Programs', 'Portfolio', 'About', 'Testimony', 'Blog', 'Contact']

export default function HeroSection() {
  const [activeItem, setActiveItem] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white-50 grid grid-cols-12 h-screen bg-[url('/images/hero_img.jpg')] bg-cover bg-center bg-no-repeat md:bg-none py-20 sm:py-0">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 flex items-center justify-between py-6 z-50 transition-all duration-300
        ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between w-full px-[8.33%]">
          <h2 className="text-xl font-bold tracking-wide">LAUNCH<span className="text-[#31de79]">PAD</span></h2>
          
          {/* Desktop Nav */}
          <ul className="hidden lg:flex lg:gap-13 text-black">
            {listItems.map(item => (
              <ListItem key={item} item={item} activeItem={activeItem} setActiveItem={setActiveItem} />
            ))}
          </ul>

          {/* Mobile Nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Menu className="lg:hidden w-6 h-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full h-full sm:w-64 flex flex-col justify-center items-center pt-10">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <h2 className="text-xl font-bold tracking-wide mb-8">LAUNCH<span className="text-[#31de79]">PAD</span></h2>
              <ul className="flex flex-col gap-6 items-center w-full px-6">
                {listItems.map(item => (
                  <MobileListItem key={item} item={item} activeItem={activeItem} setActiveItem={setActiveItem} setOpen={setOpen} />
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="col-start-2 col-span-10 md:col-start-2 md:col-span-5 flex flex-col justify-center items-center md:items-start pr-15 gap-10">
        <h1 className="text-green-500 tracking-widest text-center md:text-left">WELCOME TO LAUNCHPAD HUB</h1>
        <p className="text-[35px] sm:text-[40px] capitalize tracking-wide text-center md:text-left text-white md:text-black">where bold ideas become <span className="font-bold">thriving startups</span></p>
        <p className="text-xl md:text-lg tracking-wide text-center md:text-left text-gray-200 md:text-black">We provide early-stage founders with the office space, seed funding, mentorship, and pitch opportunities they need to turn their vision into reality.</p>
        <Link href="/register">
          <Button style={{background: 'linear-gradient(to right, #7ac64d, #31de79)'}} className="self-center md:self-start px-12 py-7 text-md rounded-full">Apply Now</Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="col-start-7 col-span-6 hidden md:block relative w-full -z-1">
        <Image src={heroImage} alt="hero image" fill className="object-cover"/>
      </div>
    </div>
  )
}