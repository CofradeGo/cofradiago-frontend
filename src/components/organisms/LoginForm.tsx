import React, { useState } from "react";
import { InputField } from "../atoms/InputField";
import { Button } from "../atoms/Button";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "El email es obligatorio";
    if (!password) newErrors.password = "La contraseña es obligatoria";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(email, password);
    }
  };

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputField
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={errors.email ? "border-red-500" : ""}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <InputField
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={errors.password ? "border-red-500" : ""}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <Button type="submit">Entrar</Button>
    </form>
  );
};
