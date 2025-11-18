import React from "react";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import AuthLayout from "../../components/layouts/AuthLayout";

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <form className="flex flex-col">
        <Input label="Email" type="email" />
        <Input label="Contraseña" type="password" />
        <Button type="submit">Entrar</Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
