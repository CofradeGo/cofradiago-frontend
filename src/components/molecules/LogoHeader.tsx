import React from "react";
import { Logo } from "../atoms/Logo";

interface LogoHeaderProps {
  cofradeLogo: string;
  hdadLogo: string;
  hdadName: string;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({ cofradeLogo, hdadLogo, hdadName }) => (
  <div className="flex flex-col items-center mb-6">
    <div className="flex space-x-6 mb-4">
      <Logo src={cofradeLogo} alt="CofradeGO Logo" />
      <Logo src={hdadLogo} alt="Hermandad Logo" />
    </div>
    <h2 className="text-lg font-medium text-gray-700">{hdadName}</h2>
  </div>
);
