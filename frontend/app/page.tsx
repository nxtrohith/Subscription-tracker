import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}