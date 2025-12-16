// src/components/organisms/CreateAuxUserSection.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useUsuario } from "../../hooks/useUser";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

interface CreateAuxUserSectionProps {
  currentUserRole: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
}

export const CreateAuxUserSection: React.FC<CreateAuxUserSectionProps> = ({ currentUserRole }) => {
  const { createAuxUser, refetchUsers } = useUsuario();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await createAuxUser(data);
      refetchUsers();
      reset();
      alert("Usuario AUX creado correctamente ✅");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear usuario");
    }
  };

  if (currentUserRole !== "DMG") {
    return (
      <div className="text-gray-500 text-center py-12">
        Solo los usuarios DMG pueden crear auxiliares.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Crear Usuario Auxiliar</h2>
      <p className="text-gray-500 text-sm text-center mb-4">
        Ingresa los datos del nuevo usuario AUX.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Username */}
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            {...register("username", { required: "El nombre es obligatorio" })}
            type="text"
            placeholder="Nombre de usuario"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              errors.username
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email inválido",
              },
            })}
            type="email"
            placeholder="Correo electrónico"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
            })}
            type="password"
            placeholder="Contraseña"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 w-full py-3 rounded-lg text-white font-semibold transition-colors ${
            isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Creando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
};
