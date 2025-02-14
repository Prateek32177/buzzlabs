export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className='fixed inset-0 overflow-hidden' aria-hidden='true'>
        <div
          className='absolute inset-0 opacity-20 mix-blend-overlay'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.975' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />
        <div
          className='absolute inset-0 opacity-10 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='microNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23microNoiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        <div className='absolute top-0 left-0 w-full to-transparent h-full'>
          <div
            className='absolute inset-0'
            style={{
              background: `
                radial-gradient(
                  80% 100% at 50% 0%,
                  transparent 30%,
                  rgba(24, 24, 27, 0.4) 50%,
                  rgba(24, 24, 27, 0.8) 100%
                )
              `,
            }}
          />
        </div>

        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/10 to-zinc-900/30' />
      </div>
      <h1>Hello world!</h1>
    </main>
  );
}
