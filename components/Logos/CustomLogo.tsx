export const CustomLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`lucide lucide-workflow-icon lucide-workflow ${className}`}
    >
      <rect width='8' height='8' x='3' y='3' rx='2' />
      <path d='M7 11v4a2 2 0 0 0 2 2h4' />
      <rect width='8' height='8' x='13' y='13' rx='2' />
    </svg>
  );
};
