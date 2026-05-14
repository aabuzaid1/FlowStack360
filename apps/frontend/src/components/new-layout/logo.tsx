'use client';

import Link from 'next/link';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Link href="/launches" className="flex items-center justify-center mt-[8px] mb-[4px]">
      <div className="flex items-center justify-center relative w-[48px] h-[48px]">
        <Image src="/logo.png" alt="FlowStack360 Logo" fill className="object-contain" />
      </div>
    </Link>
  );
};
