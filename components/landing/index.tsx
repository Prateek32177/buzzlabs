import { Navbar } from '@/components/landing/navbar';
import Introduction from './Introduction';
import WaitlistSection from './Waitlist';
import IntegrationSection from './inetgration';
import Features from './Features';
import { HowItWorks } from './HowItWorks';
import { Footer } from './footer';
import Hero from './Hero';

const Index = () => {
  return (
    <div className=' text-white w-full'>
      <Navbar />
      <Hero />
      <Introduction />
      <Features />
      <IntegrationSection />
      <HowItWorks />
      <WaitlistSection />
      <Footer />
    </div>
  );
};

export default Index;
