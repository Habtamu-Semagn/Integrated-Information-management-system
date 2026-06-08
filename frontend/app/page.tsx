
import About from "@/components/common/About";
import Blog from "@/components/common/Blog";
import Contact from "@/components/common/Contact";
import FAQ from "@/components/common/FAQ";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/common/Hero";
import Overview from "@/components/common/Overview";
import Partners from "@/components/common/Partners";
import Process from "@/components/common/Process";
import Projects from "@/components/common/Projects";
import Services from "@/components/common/Services";
import Staff from "@/components/common/Staff";
import Testimonial from "@/components/common/Testimonial";

export default function Home() {
  
  return (
    <>
        <section id="home"><HeroSection /></section>
        <section id="services"><Services /></section>
        <section id="projects"><Projects /></section>
        <section id="about">
          <About />
          <Staff />
          <Overview />
          <Process />
          <Partners />
          <FAQ />
        </section>
        <section id="testimony"><Testimonial /></section>
        <section id="blog"><Blog /></section>
        <section id="contact">
          <Contact />
          <Footer />
        </section>
    </>
  );
}
