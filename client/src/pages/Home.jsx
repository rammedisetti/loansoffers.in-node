import Hero from '../sections/Hero.jsx';
import LoanCategories from '../sections/LoanCategories.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import WhyChooseUs from '../sections/WhyChooseUs.jsx';
import PartnerBanks from '../sections/PartnerBanks.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import BlogPreview from '../sections/BlogPreview.jsx';
import CtaBanner from '../sections/CtaBanner.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <LoanCategories />
      <HowItWorks />
      <WhyChooseUs />
      <PartnerBanks />
      <Testimonials />
      <BlogPreview />
      <CtaBanner />
    </>
  );
}
