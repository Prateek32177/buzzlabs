import Link from 'next/link';

export default function VerificationFailed() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full px-4'>
      <div className='max-w-md w-full  p-8 rounded-lg shadow-md text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6'>
          <svg
            className='w-8 h-8 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            ></path>
          </svg>
        </div>

        <h1 className='text-2xl font-bold text-gray-200 mb-3'>
          Verification Failed
        </h1>

        <p className='text-gray-600 mb-6'>
          We couldn't verify your email. The verification link may be expired or
          invalid.
        </p>

        <div className='space-y-3'>
          <Link
            href='/'
            className='inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
