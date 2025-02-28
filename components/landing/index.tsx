import { Navbar } from '@/components/landing/navbar';
import { ArrowRight } from 'lucide-react';
import Introduction from './Introduction';
import WaitlistSection from './Waitlist';
import IntegrationSection from './inetgration';
import Features from './Features';
import { HowItWorks } from './HowItWorks';
import { Footer } from './footer';
import Hero from './Hero';

const Index = () => {
  return (
    <div className='min-h-screen   text-white w-full'>
      <Navbar />
      <Hero />
      <Introduction />
      <Features />

      {/* <div className='relative'>
        <div className='aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-black/40 border border-white/10 shadow-xl'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center'>
                <ArrowRight className='h-8 w-8 text-white' />
              </div>
              <p className='text-white/80'>Interactive Demo</p>
              <span className='ml-2 text-xs font-semibold text-yellow-400 bg-yellow-100/5 px-2 py-1 rounded'>
                Coming Soon
              </span>
            </div>
          </div>
        </div>
        <div className='absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl'></div>
        <div className='absolute -bottom-8 -left-8 w-40 h-40 bg-purple-700/10 rounded-full blur-xl'></div>
      </div> */}

      <IntegrationSection />
      <HowItWorks />
      <WaitlistSection />
      <Footer />
    </div>
  );
};

export default Index;
