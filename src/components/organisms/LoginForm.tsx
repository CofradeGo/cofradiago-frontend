import React from "react";
import { InputField } from "../atoms/InputField";
import { Button } from "../atoms/Button";

interface LoginFormProps {
  usernameProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  passwordProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  onSubmit: (username: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  usernameProps,
  passwordProps,
  onSubmit,
  loading = false,
  error,
}) => {
  const [localErrors, setLocalErrors] = React.useState<{ username?: string; password?: string }>(
    {},
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { username?: string; password?: string } = {};
    if (!usernameProps.value) newErrors.username = "El usuario es obligatorio";
    if (!passwordProps.value) newErrors.password = "La contraseña es obligatoria";

    setLocalErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(usernameProps.value, passwordProps.value);
    }
  };

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm">Usuario o contraseña no válidos</p>}

      <InputField
        type="text"
        placeholder="Usuario"
        {...usernameProps}
        className={localErrors.username ? "border-red-500" : ""}
        disabled={loading}
      />
      {localErrors.username && <p className="text-red-500 text-sm">{localErrors.username}</p>}

      <InputField
        type="password"
        placeholder="Contraseña"
        {...passwordProps}
        className={localErrors.password ? "border-red-500" : ""}
        disabled={loading}
      />
      {localErrors.password && <p className="text-red-500 text-sm">{localErrors.password}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </Button>
    </form>
  );
};
