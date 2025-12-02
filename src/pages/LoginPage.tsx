import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoginLayout } from "../components/layouts/LoginLayout";
import CofradeGoLogo from "../assets/logos/logo-cofradego.png";
import { useHermandad } from "../hooks/useHermandad";
import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/organisms/LoginForm";

export const LoginPage: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();

  // Info de la hermandad
  const { data: hermandad, loading: loadingHdad, error: errorHdad } = useHermandad(domain || "");

  // Hook de login
  const { login, loading: loadingLogin, error: errorLogin } = useLogin(domain || "");

  // Estado controlado de inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Manejo de loading/error de hermandad
  if (loadingHdad) return <div className="text-center mt-10">Cargando hermandad...</div>;
  if (errorHdad) return <div className="text-red-500 text-center mt-10">{errorHdad}</div>;

  // Submit del login
  const handleSubmit = (username: string, password: string) => {
    login({ username, password }).then((res) => {
      if (res) {
        navigate(`/${domain}/dashboard`);
      }
    });
  };

  return (
    <LoginLayout
      cofradeLogo={CofradeGoLogo}
      hdadLogo={hermandad?.logoUrl || "https://via.placeholder.com/112"}
      hdadName={hermandad?.name || "Hermandad desconocida"}
    >
      <LoginForm
        usernameProps={{
          value: username,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
        }}
        passwordProps={{
          value: password,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
        }}
        onSubmit={handleSubmit}
        loading={loadingLogin}
        error={errorLogin}
      />
    </LoginLayout>
  );
};
