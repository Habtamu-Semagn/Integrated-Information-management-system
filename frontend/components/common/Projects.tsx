"use client"
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react"
import project1image from "@/public/images/project-1.jpg"
import project2image from "@/public/images/project-2.jpg"
import project3image from "@/public/images/project-3.jpg"
import project4image from "@/public/images/project-4.jpg"
import project5image from "@/public/images/project-5.jpg"
import project6image from "@/public/images/project-6.jpg"

const projects = [
    { imagesrc: project1image, altname: "AgriTech Ethiopia", name: "AGRITECH ETHIOPIA", category: "Agriculture & Tech" },
    { imagesrc: project2image, altname: "MediLink Africa", name: "MEDILINK AFRICA", category: "Health & Telemedicine" },
    { imagesrc: project3image, altname: "EduReach", name: "EDUREACH", category: "EdTech & E-Learning" },
    { imagesrc: project4image, altname: "LogiMove", name: "LOGIMOVE", category: "Logistics & Supply Chain" },
    { imagesrc: project5image, altname: "GreenGrid", name: "GREENGRID", category: "Clean Energy & Sustainability" },
    { imagesrc: project6image, altname: "FinNest", name: "FINNEST", category: "Fintech & Microfinance" },
]

const GAP = 16

const getWindow = (centerIndex: number) => {
  const len = projects.length;
  return [-2, -1, 0, 1, 2].map((offset) => {
    const i = ((centerIndex + offset) % len + len) % len;
    return { ...projects[i], realIndex: i };
  });
}

export default function PortfolioSection() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [visibleWindow, setVisibleWindow] = useState(() => getWindow(0));
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPaused = useRef(false);
  const isAnimating = useRef(false);

  const getItemWidth = useCallback(() => {
    if (!scrollRef.current) return 0;
    const containerWidth = scrollRef.current.offsetWidth;
    if (containerWidth < 640) return containerWidth * 0.75;
    return (containerWidth - GAP * 2) / 3;
  }, []);

  const scrollToCenter = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (!scrollRef.current) return;
    const itemWidth = getItemWidth();
    const containerWidth = scrollRef.current.offsetWidth;
    const centerItemLeft = 2 * (itemWidth + GAP);
    const offset = centerItemLeft - (containerWidth - itemWidth) / 2;
    scrollRef.current.scrollTo({ left: offset, behavior });
  }, [getItemWidth]);

  const goNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const nextCenter = (centerIndex + 1) % projects.length;
    if (scrollRef.current) {
      const itemWidth = getItemWidth();
      const containerWidth = scrollRef.current.offsetWidth;
      const nextItemLeft = 3 * (itemWidth + GAP);
      const offset = nextItemLeft - (containerWidth - itemWidth) / 2;
      scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }
    setTimeout(() => {
      setCenterIndex(nextCenter);
      setVisibleWindow(getWindow(nextCenter));
      if (scrollRef.current) {
        const itemWidth = getItemWidth();
        const containerWidth = scrollRef.current.offsetWidth;
        const centerItemLeft = 2 * (itemWidth + GAP);
        const offset = centerItemLeft - (containerWidth - itemWidth) / 2;
        scrollRef.current.scrollTo({ left: offset, behavior: "instant" });
      }
      isAnimating.current = false;
    }, 500);
  }, [centerIndex, getItemWidth]);

  const goPrev = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const prevCenter = (centerIndex - 1 + projects.length) % projects.length;
    if (scrollRef.current) {
      const itemWidth = getItemWidth();
      const containerWidth = scrollRef.current.offsetWidth;
      const prevItemLeft = 1 * (itemWidth + GAP);
      const offset = prevItemLeft - (containerWidth - itemWidth) / 2;
      scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
    }
    setTimeout(() => {
      setCenterIndex(prevCenter);
      setVisibleWindow(getWindow(prevCenter));
      if (scrollRef.current) {
        const itemWidth = getItemWidth();
        const containerWidth = scrollRef.current.offsetWidth;
        const centerItemLeft = 2 * (itemWidth + GAP);
        const offset = centerItemLeft - (containerWidth - itemWidth) / 2;
        scrollRef.current.scrollTo({ left: offset, behavior: "instant" });
      }
      isAnimating.current = false;
    }, 500);
  }, [centerIndex, getItemWidth]);

  const goTo = useCallback((realIndex: number) => {
    if (isAnimating.current) return;
    const diff = (realIndex - centerIndex + projects.length) % projects.length;
    if (diff === 0) return;
    if (diff <= projects.length / 2) {
      let count = 0;
      const forward = setInterval(() => {
        goNext();
        count++;
        if (count >= diff) clearInterval(forward);
      }, 600);
    } else {
      const back = projects.length - diff;
      let count = 0;
      const backward = setInterval(() => {
        goPrev();
        count++;
        if (count >= back) clearInterval(backward);
      }, 600);
    }
  }, [centerIndex, goNext, goPrev]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) goNext();
    }, 2500);
  }, [goNext]);

  const stopAutoPlay = () => { isPaused.current = true; };
  const resumeAutoPlay = () => { isPaused.current = false; };

  useEffect(() => { scrollToCenter("instant"); }, [scrollToCenter]);
  useEffect(() => {
    startAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoPlay]);

  return (
    <div className="lg:grid lg:grid-cols-12 pb-20 pt-30">
      <div className="lg:col-start-2 lg:col-span-10 flex flex-col items-center gap-4">

        {/* Header */}
        <p className="text-sm font-semibold tracking-widest text-green-500 uppercase">
          our portfolio
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 tracking-tight text-center">
          Startups We've Incubated
        </h2>
        <p className="text-gray-500 font-light text-center max-w-xl leading-relaxed px-4">
          Meet the innovative startups that have grown through our incubation program — each one a testament to what great ideas, the right support, and determination can achieve.
        </p>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="w-full mt-6 overflow-x-hidden"
          style={{ display: "flex", gap: `${GAP}px` }}
          onMouseEnter={stopAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          {visibleWindow.map((project, index) => {
            const isMobile = typeof globalThis !== "undefined" && globalThis.innerWidth < 640;
            const itemWidth = isMobile ? "75vw" : `calc((100% - ${GAP * 2}px) / 3)`;

            return (
              <div
                key={`${project.realIndex}-${index}`}
                className="relative flex-shrink-0 h-[280px] sm:h-[400px] cursor-pointer overflow-hidden group"
                style={{ width: itemWidth }}
                onClick={() => {
                  if (index === 1) goPrev();
                  if (index === 3) goNext();
                }}
              >
                <Image
                  src={project.imagesrc}
                  alt={project.altname}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end">
                  <div className="bg-[#3DB85C] px-5 py-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col gap-1">
                    <p className="text-white text-base font-bold tracking-tight">
                      {project.name}
                    </p>
                    <p className="text-white text-sm font-normal">
                      {project.category}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Dot Navigation */}
        <div className="flex gap-3 mt-4">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300
                ${centerIndex === index ? "bg-green-500" : "bg-gray-400 hover:bg-gray-300"}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}