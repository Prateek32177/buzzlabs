import { Navbar } from '@/components/landing/navbar';
import Introduction from './Introduction';
import IntegrationSection from './inetgration';
import Features from './Features';
import { Footer } from './footer';
import Hero from './Hero';
import TryYourself from './try-yourself';
import { UseCaseSection } from './Use-case';

const Index = () => {
  return (
    <div className=' text-white w-full'>
      <Navbar />
      <Hero />
      <Introduction />
      <Features />
      <UseCaseSection />
      <IntegrationSection />
      <TryYourself />
      <Footer />
    </div>
  );
};

export default Index;
