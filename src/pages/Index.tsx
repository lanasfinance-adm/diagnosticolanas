import { useRef } from "react";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import LeadForm from "@/components/LeadForm";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      <Hero onCtaClick={scrollToForm} />
      <Benefits />
      <Testimonials />
      <FAQ />
      <LeadForm formRef={formRef} />
      <Footer />
    </main>
  );
};

export default Index;
