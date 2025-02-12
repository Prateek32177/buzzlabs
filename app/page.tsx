import Hero from '@/components/hero';

export default async function Home() {
  return (
    <>
      <Hero />
      <main className='flex flex-1 flex-col gap-6 px-4'>
        <h1>Hello Guys</h1>
      </main>
    </>
  );
}
