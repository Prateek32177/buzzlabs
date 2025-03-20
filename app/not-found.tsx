import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='py-8 px-4 m-auto max-w-screen-xl lg:py-16 lg:px-6 items-center text-center'>
      <div className='m-auto max-w-screen-sm text-center'>
        <h1 className='mb-4 text-2xl tracking-tight font-extrabold lg:text-4xl text-primary-600 dark:text-primary-500'>
          Error 404 | Page Not Found
        </h1>
        <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
          Sorry, we can't find that page. You'll find lots to explore on the
          home page.{' '}
        </p>
        <Link
          href='/'
          className='inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
