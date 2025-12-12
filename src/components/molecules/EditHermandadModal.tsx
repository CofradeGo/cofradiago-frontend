import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { Hermandad } from "../../hooks/useHermandad";

interface EditHermandadModalProps {
  isOpen: boolean;
  onClose: () => void;
  hermandad: Hermandad;
  updateHermandad: (formData: FormData) => Promise<Hermandad>;
  onUpdated: () => void; // callback para actualizar la vista
}

export const EditHermandadModal: React.FC<EditHermandadModalProps> = ({
  isOpen,
  onClose,
  hermandad,
  updateHermandad,
  onUpdated,
}) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Inicializamos los valores cada vez que se abre el modal
  useEffect(() => {
    if (isOpen && hermandad) {
      setName(hermandad.name);
      setEmail(hermandad.officialEmail || "");
      setPreview(hermandad.logoUrl || null);
      setLogoFile(null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, hermandad]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setLogoFile(file);
        setPreview(URL.createObjectURL(file));
      }
    },
  });

  const handleSubmit = async () => {
    if (!name || !email) {
      setError("Todos los campos obligatorios deben completarse");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("officialEmail", email);
    if (logoFile) formData.append("logoUrl", logoFile);

    try {
      setLoading(true);
      await updateHermandad(formData);
      onUpdated(); // actualiza la vista
      setSuccess("La hermandad se ha actualizado correctamente");
      setTimeout(() => setSuccess(null), 3000);
      onClose();
    } catch (err) {
      setError("Error al actualizar la hermandad: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        {success && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
            {success}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Editar Hermandad</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email oficial"
            className="border rounded px-3 py-2 w-full"
          />

          {/* Drag & Drop */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input {...getInputProps()} />
            {preview ? (
              <>
                <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-full" />
                <p className="text-gray-500">Haz click para subir una nueva imagen</p>
              </>
            ) : isDragActive ? (
              <p>¡Suelta la imagen aquí!</p>
            ) : (
              <p>Arrastra y suelta el logo o haz click para seleccionar</p>
            )}
          </div>

          {error && <p className="text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
