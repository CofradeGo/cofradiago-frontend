import React from "react";

interface LogoProps {
  src: string;
  alt: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ src, alt, size = 112 }) => (
  <img src={src} alt={alt} className={`w-${size} h-${size} object-contain`} />
);
