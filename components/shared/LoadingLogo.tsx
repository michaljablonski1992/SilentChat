import React from 'react';
import Image from 'next/image';

type Props = {
  size?: number;
};

const LoadingLogo: React.FC = ({ size = 200 }: Props) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Image
        src="/logo1.png"
        alt="Logo"
        width={size}
        height={size}
        className="animate-pulse duration-800"
      />
    </div>
  );
};

export default LoadingLogo;
