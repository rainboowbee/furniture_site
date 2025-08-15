import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Process from "@/components/Process";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <div className="font-sans bg-black text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
