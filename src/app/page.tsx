import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Transparency from "@/components/landing/Transparency";
import Promises from "@/components/landing/Promises";
import CTA from "@/components/landing/CTA";
import { getAllContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getAllContent();

  return (
    <>
      <Hero content={content.hero} />
      <HowItWorks content={content.howItWorks} />
      <Promises content={content.promises} />
      <Transparency content={content.transparency} />
      <CTA content={content.cta} />
    </>
  );
}
