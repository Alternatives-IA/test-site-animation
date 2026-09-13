import { Hero3D } from "@/components/Hero3D";
import { BookingBar } from "@/components/BookingBar";
import { FleetSection } from "@/components/sections/FleetSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StorySection } from "@/components/sections/StorySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Hero3D />
      <BookingBar />
      <FleetSection />
      <CategoriesSection />
      <ServicesSection />
      <StorySection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
