import { About } from "@/components/About";
import { AnchorNav } from "@/components/AnchorNav";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { TechStack } from "@/components/TechStack";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AnchorNav />
      <Services />
      <About />
      <Process />
      <TechStack />
      {/* <ClientStories /> */}
      <Contact />
      <Footer />
    </main>
  );
}
