import * as React from 'react';

export const HookfloIcon = props => (
  <svg
    width='100'
    height='100'
    viewBox='0 0 300 400'
    fill='#A692E5'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
    className=' w-10 h-10'
  >
    {/* Column 1 */}
    <circle cx='75' cy='75' r='30' /> {/* Dot 1 */}
    <circle cx='75' cy='175' r='30' /> {/* Dot 2 */}
    <circle cx='75' cy='275' r='30' /> {/* Dot 3 */}
    {/* Column 2 */}
    <circle cx='150' cy='75' r='30' /> {/* Dot 4 */}
    <circle cx='150' cy='175' r='30' /> {/* Dot 5 */}
    <circle cx='150' cy='275' r='30' fill='#fff' /> {/* Dot 6 */}
    {/* Column 3 (Optional Extended Design) */}
    <circle cx='225' cy='175' r='30' />
    <circle cx='225' cy='275' r='30' />
  </svg>
);
