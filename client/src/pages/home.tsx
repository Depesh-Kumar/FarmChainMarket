import { Helmet } from "react-helmet";
import HeroSection from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import Features from "@/components/home/features";
import ProductShowcase from "@/components/home/product-showcase";
import DashboardPreview from "@/components/home/dashboard-preview";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>FarmChain - Connecting Farmers Directly to Buyers</title>
        <meta name="description" content="FarmChain is a B2B marketplace that connects farmers directly with businesses, eliminating middlemen and ensuring better prices." />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Helmet>
      
      <HeroSection />
      <HowItWorks />
      <Features />
      <ProductShowcase />
      <DashboardPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
