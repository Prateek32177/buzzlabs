import { Logo } from '../Logo';

export function Footer() {
  return (
    <footer className='bg-[#0A0A0B] py-10 px-4 border-t border-white/5 gradient-background'>
      <div className='container mx-auto max-w-6xl'>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          <div>
            <div className='mb-4'>
              <Logo size='text-2xl' />
            </div>
            <p className='text-white/70 text-sm'>
              Building the future of notification webhook infrastructure
            </p>
          </div>

          {/* {[
                  {
                    title: 'Legal',
                    links: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
                  },
                ].map(section => (
                  <div key={section.title}>
                    <h3 className='font-medium mb-4 text-white'>{section.title}</h3>
                    <ul className='space-y-2'>
                      {section.links.map(link => (
                        <li key={link}>
                          <a
                            href='#'
                            className='text-white/70 hover:text-white transition-colors'
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))} */}
        </div>

        <div className='border-t border-white/5 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-white/70 text-sm'>
              © 2025 Hookflo. All rights reserved.
            </p>
            {/* <div className='flex gap-6'>
              <a
                href='#'
                className='text-white/70 hover:text-white transition-colors'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='text-white/70 hover:text-white transition-colors'
              >
                Terms of Service
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
