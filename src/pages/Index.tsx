import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseMe from "@/components/WhyChooseMe";
import Catalog from "@/components/Catalog";
import AboutMe from "@/components/AboutMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen smooth-scroll">
      <Navbar />
      <main>
        <Hero />
        <WhyChooseMe />
        <Catalog />
        <AboutMe />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
