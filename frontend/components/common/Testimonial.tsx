"use client"
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react"
import person1profile from "@/public/images/person_1.jpg"
import person2profile from "@/public/images/person_2.jpg"
import person3profile from "@/public/images/person_3.jpg"
import person4profile from "@/public/images/person_4.jpg"
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
    { imagesrc: person1profile, altname: "Sara Mengistu", name: "Sara Mengistu", role: "Founder, AgriTech Ethiopia" },
    { imagesrc: person2profile, altname: "Daniel Tadesse", name: "Daniel Tadesse", role: "CEO, MediLink Africa" },
    { imagesrc: person3profile, altname: "Hana Bekele", name: "Hana Bekele", role: "Co-Founder, EduReach" },
    { imagesrc: person4profile, altname: "Yonas Girma", name: "Yonas Girma", role: "Founder, LogiMove" },
]

const quotes = [
    "LaunchPad Hub gave us more than office space — they gave us the mentorship and investor connections that turned our idea into a funded startup.",
    "Winning the pitch competition here was a turning point. The exposure and seed funding we received helped us scale faster than we ever imagined.",
    "The incubation program challenged us to think bigger. Within six months we had our first 10,000 users and a committed investor on board.",
    "From day one, the environment here pushed us to move fast and iterate. The mentors understood our vision and helped us sharpen every aspect of our business.",
]

const GAP = 16

const getWindow = (centerIndex: number) => {
  const len = testimonials.length;
  return [-2, -1, 0, 1, 2].map((offset) => {
    const i = ((centerIndex + offset) % len + len) % len;
    return { ...testimonials[i], quote: quotes[i], realIndex: i };
  });
}

export default function TestimonySection() {
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
    const nextCenter = (centerIndex + 1) % testimonials.length;
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
    const prevCenter = (centerIndex - 1 + testimonials.length) % testimonials.length;
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
    const diff = (realIndex - centerIndex + testimonials.length) % testimonials.length;
    if (diff === 0) return;
    if (diff <= testimonials.length / 2) {
      let count = 0;
      const forward = setInterval(() => {
        goNext();
        count++;
        if (count >= diff) clearInterval(forward);
      }, 600);
    } else {
      const back = testimonials.length - diff;
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
    <div className="lg:grid lg:grid-cols-12 pb-20 pt-30 bg-[#42E47A]">
      <div className="lg:col-start-2 lg:col-span-10 flex flex-col items-center gap-4 mb-10">
        <p className="text-sm font-semibold tracking-widest text-white/80 uppercase">founder stories</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tight text-center">
          words from our founders
        </h2>
      </div>

      <div className="lg:col-start-1 lg:col-span-12 flex flex-col items-center">
        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-hidden"
          style={{ display: "flex", gap: `${GAP}px` }}
          onMouseEnter={stopAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          {visibleWindow.map((item, index) => {
            const isMobile = typeof globalThis !== "undefined" && globalThis.innerWidth < 640;
            const itemWidth = isMobile ? "75vw" : `calc((100% - ${GAP * 2}px) / 3)`;

            return (
              <div
                key={`${item.realIndex}-${index}`}
                className="flex-shrink-0 flex flex-col items-center h-[500px] sm:h-[500px] cursor-pointer overflow-hidden bg-[#42E47A]"
                style={{ width: itemWidth }}
                onClick={() => {
                  if (index === 1) goPrev();
                  if (index === 3) goNext();
                }}
              >
                <div className="relative w-30 h-30 flex-shrink-0 z-10">
                  <Image
                    src={item.imagesrc}
                    alt={item.altname}
                    className="w-30 h-30 border-[#42E47A] border-xl rounded-full transition-transform duration-500 translate-y-15 border-7"
                  />
                  <div style={{ background: 'linear-gradient(to bottom right, #3aff3aff, #31de79)' }} className="absolute -bottom-15 right-0 w-10 h-10 rounded-full flex items-center justify-center z-999">
                    <FaQuoteLeft className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-10 items-center bg-white pt-20 pb-15 px-5 text-center">
                  <p className="text-gray-700 tracking-wide text-lg leading-loose">{item.quote}</p>
                  <div>
                    <p className="text-black text-xl">{item.name}</p>
                    <p className="text-gray-400">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Navigation */}
        <div className="flex gap-3 mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300
                ${centerIndex === index ? "bg-white" : "bg-gray-400 hover:bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}