import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Transparency from "@/components/landing/Transparency";
import Promises from "@/components/landing/Promises";
import CTA from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Promises />
      <Transparency />
      <CTA />
    </>
  );
}
