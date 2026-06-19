"use client"
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function ListItem({item, activeItem, setActiveItem}:{item: string, activeItem: string, setActiveItem: React.Dispatch<React.SetStateAction<string>>}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = item === activeItem;

  const handleClick = () => {
    setActiveItem(item);
    
    // Map menu items to section IDs
    const sectionMap: Record<string, string> = {
      'Home': 'home',
      'Services': 'services',
      'Projects': 'projects',
      'About': 'about',
      'Testimony': 'testimony',
      'Blog': 'blog',
      'Contact': 'contact'
    };
    
    const sectionId = sectionMap[item] || item.toLowerCase();
    
    // If we're on the landing page, scroll to section
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we're on auth page, redirect to landing page with hash
      router.push(`/#${sectionId}`);
    }
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
  const router = useRouter();
  const pathname = usePathname();
  const isActive = item === activeItem;

  const handleClick = () => {
    setActiveItem(item);
    setOpen(false);
    
    // Map menu items to section IDs
    const sectionMap: Record<string, string> = {
      'Home': 'home',
      'Services': 'services',
      'Projects': 'projects',
      'About': 'about',
      'Testimony': 'testimony',
      'Blog': 'blog',
      'Contact': 'contact'
    };
    
    const sectionId = sectionMap[item] || item.toLowerCase();
    
    // If we're on the landing page, scroll to section
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we're on auth page, redirect to landing page with hash
      router.push(`/#${sectionId}`);
    }
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

const listItems = ['Home', 'Services', 'Projects', 'About', 'Testimony', 'Blog', 'Contact']

export default function NavbarOnly() {
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
    <nav className={`fixed top-0 left-0 right-0 flex items-center justify-between py-6 z-50 transition-all duration-300
      ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between w-full px-[8.33%]">
        <Link href="/">
          <h2 className="text-xl font-bold tracking-wide cursor-pointer">INCUB<span className="text-[#31de79]">ATION</span></h2>
        </Link>
        
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
            <h2 className="text-xl font-bold tracking-wide mb-8">INCUB<span className="text-[#31de79]">ATION</span></h2>
            <ul className="flex flex-col gap-6 items-center w-full px-6">
              {listItems.map(item => (
                <MobileListItem key={item} item={item} activeItem={activeItem} setActiveItem={setActiveItem} setOpen={setOpen} />
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
