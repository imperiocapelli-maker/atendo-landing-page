import React from 'react';

interface AtendoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const AtendoLogo: React.FC<AtendoLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 16 },
    md: { icon: 32, text: 20 },
    lg: { icon: 48, text: 28 },
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded Square Background */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="12"
          fill="#175EF0"
        />
        
        {/* Letter A */}
        <path
          d="M32 16L44 44H40L37 36H27L24 44H20L32 16Z"
          fill="white"
        />
        <rect x="28" y="32" width="8" height="2" fill="#175EF0" />
      </svg>

      {/* Logo Text */}
      {showText && (
        <span
          className="font-bold text-foreground"
          style={{ fontSize: `${text}px` }}
        >
          Atendo
        </span>
      )}
    </div>
  );
};

export default AtendoLogo;
