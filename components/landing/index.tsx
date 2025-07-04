import { Navbar } from '@/components/landing/navbar';
import Introduction from './Introduction';
import IntegrationSection from './inetgration';
import Features from './Features';
import { Footer } from './footer';
import Hero from './Hero';
import TryYourself from './try-yourself';
import { UseCaseSection } from './Use-case';
import Dashboard from './Dashboard';
const Index = () => {
  return (
    <div className=' text-white w-full bg-neutral-950/50'>
      <Navbar />
      <Hero />
      <Dashboard/>
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
