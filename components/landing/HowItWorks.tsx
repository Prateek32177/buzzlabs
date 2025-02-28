export const HowItWorks = () => {
  return (
    <section className='py-20 px-4 relative bg-[#080809]'>
      <div className='container mx-auto max-w-6xl'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-6xl font-bold mb-4 hero-text-gradient'>
            How It Works
          </h2>
          <p className='text-white/70 max-w-2xl mx-auto text-lg'>
            Capture events and send notifications in three simple steps
          </p>
        </div>

        <div className='steps-container'>
          <div className='connecting-line'></div>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                step: 1,
                title: 'Set up and get organized',
                description:
                  'Connect SuperHook with your existing systems in minutes',
              },
              {
                step: 2,
                title: 'Monitor progress',
                description:
                  'Set up event triggers and notification channels effortlessly',
              },
              {
                step: 3,
                title: 'Stay on track',
                description:
                  'Automatically receive notifications when events occur',
              },
            ].map(item => (
              <div key={item.step} className='step-card group'>
                <div className='step-number border'>{item.step}</div>
                <h3 className='step-heading text-lg md:text-xl font-medium mb-2 text-white'>
                  {item.title}
                </h3>
                <p className='step-description text-white/70 text-sm md:text-base'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
