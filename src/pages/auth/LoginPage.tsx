import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoginLayout } from "../../components/layouts/LoginLayout";
import CofradeGoLogo from "../../assets/logos/logo-cofradego.svg";
import { useHermandad } from "../../hooks/useHermandad";
import { useLogin } from "../../hooks/useLogin";
import { LoginForm } from "../../components/organisms/LoginForm";
import { ForgotPasswordForm } from "../../components/organisms/ForgotPasswordForm";

export const LoginPage: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();

  // Hermandad
  const { data: hermandad, loading: loadingHdad, error: errorHdad } = useHermandad(domain || "");

  // Login
  const { login, loading: loadingLogin, error: errorLogin } = useLogin(domain || "");

  // Inputs login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);

  if (loadingHdad) return <div className="text-center mt-10">Cargando hermandad...</div>;
  if (errorHdad) return <div className="text-red-500 text-center mt-10">{errorHdad}</div>;

  const handleSubmit = (username: string, password: string) => {
    login({ username, password }).then((res) => {
      if (res) navigate(`/${domain}/dashboard`);
    });
  };

  return (
    <LoginLayout
      cofradeLogo={CofradeGoLogo}
      hdadLogo={hermandad?.logoUrl || "https://via.placeholder.com/112"}
      hdadName={hermandad?.name || "Hermandad desconocida"}
      onForgotClick={!showForgot ? () => setShowForgot(true) : undefined}
    >
      {!showForgot ? (
        <LoginForm
          usernameProps={{
            value: username,
            onChange: (e) => setUsername(e.target.value),
          }}
          passwordProps={{
            value: password,
            onChange: (e) => setPassword(e.target.value),
          }}
          onSubmit={handleSubmit}
          loading={loadingLogin}
          error={errorLogin}
        />
      ) : (
        <ForgotPasswordForm domain={domain || ""} onBack={() => setShowForgot(false)} />
      )}
    </LoginLayout>
  );
};
