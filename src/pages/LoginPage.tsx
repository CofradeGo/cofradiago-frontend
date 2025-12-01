import React from "react";
import { LoginLayout } from "../components/layouts/LoginLayout";
import CofradeGoLogo from "../assets/logos/logo-cofradego.png";

export const LoginPage: React.FC = () => {
  const HDAD_LOGO = "https://via.placeholder.com/112";
  const HDAD_NAME = "Hermandad de la Esperanza";

  return <LoginLayout cofradeLogo={CofradeGoLogo} hdadLogo={HDAD_LOGO} hdadName={HDAD_NAME} />;
};
