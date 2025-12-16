import React, { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { LoginLayout } from "../../components/layouts/LoginLayout";
import CofradeGoLogo from "../../assets/logos/logo-cofradego.svg";
import { ResetPasswordForm } from "../../components/organisms/ResetPasswordForm";
import { useHermandad } from "../../hooks/useHermandad";
import { useResetPassword } from "../../hooks/useResetPassword";

export const ResetPasswordPage: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  // 🔹 Hooks siempre llamados, nunca condicionales
  const { data: hermandad, loading: loadingHdad, error: errorHdad } = useHermandad(domain || "");
  const { loading, error, success, sendResetPassword } = useResetPassword();

  // Redirigir tras éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/${domain}/login`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, domain]);

  const handleSubmit = async ({
    newPassword,
  }: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!token) return; // seguridad adicional
    try {
      await sendResetPassword({ token, newPassword });
    } catch {
      // El error ya se maneja dentro del hook useResetPassword
    }
  };

  // Render condicional según estado
  if (!token) {
    return (
      <div className="text-center text-red-500 mt-10">
        Token inválido o ausente. Verifica el enlace recibido por correo.
      </div>
    );
  }

  if (loadingHdad) {
    return <div className="text-center mt-10">Cargando hermandad...</div>;
  }

  if (errorHdad) {
    return <div className="text-red-500 text-center mt-10">{errorHdad}</div>;
  }

  return (
    <LoginLayout
      cofradeLogo={CofradeGoLogo}
      hdadLogo={hermandad?.logoUrl || "https://via.placeholder.com/112"}
      hdadName={hermandad?.name || "Hermandad desconocida"}
    >
      <div className="w-full max-w-sm mx-auto mt-10">
        {hermandad?.officialEmail && (
          <p className="text-sm text-gray-600 mb-2">Usuario: {hermandad.officialEmail}</p>
        )}

        <ResetPasswordForm
          loading={loading}
          error={error}
          success={success}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/${domain}/login`)}
        />
      </div>
    </LoginLayout>
  );
};
