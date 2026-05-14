import React from 'react';

export const LogoTextComponent = () => {
  return (
    <div className="flex items-center group cursor-pointer" dir="ltr">
      <span
        className="text-[28px] font-extrabold tracking-tight transition-transform duration-500 group-hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        FlowStack360
      </span>
    </div>
  );
};
