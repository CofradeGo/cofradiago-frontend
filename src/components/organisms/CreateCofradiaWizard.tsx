import { useState } from "react";
import type { CrearCofradiaFullInput } from "../../types/Cofradia";
import { Plus, X, Trash2 } from "lucide-react";

interface CreateCofradiaWizardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrearCofradiaFullInput) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const TOTAL_STEPS = 5;

export const CreateCofradiaWizardModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  error = null,
}: CreateCofradiaWizardModalProps) => {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<CrearCofradiaFullInput>({
    nombre: "",
    anio: new Date().getFullYear(),
    tipo: "",
    cargos: [],
    puestos: [],
    insignias: [],
    cortejos: [],
  });

  if (!open) return null;

  const nextStep = () => {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    await onSubmit(formData);
  };

  const canGoNext = () => {
    switch (step) {
      case 0:
        return !!formData.nombre && !!formData.anio && !!formData.tipo;
      case 1:
        return (formData.insignias ?? []).every(
          (i) =>
            (i.nombre ?? "").trim() !== "" &&
            (i.elementos ?? []).every((el) => (el.tipo ?? "").trim() !== "" && el.cantidad > 0),
        );
      case 2:
        return (formData.cortejos ?? []).every(
          (c) =>
            (c.nombre ?? "").trim() !== "" &&
            (c.tramos ?? []).every((t) => (t.nombre ?? "").trim() !== ""),
        );
      case 3:
        return (
          (formData.cargos ?? []).every((c) => (c.nombre ?? "").trim() !== "") &&
          (formData.puestos ?? []).every((p) => (p.nombre ?? "").trim() !== "")
        );
      default:
        return true;
    }
  };

  const cardStyle = "bg-white shadow-md rounded-lg p-4 border border-gray-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-5xl rounded-lg bg-gray-50 shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold">Crear Cofradía</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-2 text-sm text-gray-500 flex items-center justify-between">
          <span>
            Paso {step + 1} de {TOTAL_STEPS}
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded ml-4 mr-2">
            <div
              className="h-2 bg-blue-600 rounded transition-all"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {/* PASO 0 – Datos básicos */}
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Nombre"
                value={formData.nombre ?? ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Año"
                value={formData.anio ?? ""}
                onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) })}
                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                placeholder="Tipo"
                value={formData.tipo ?? ""}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* PASO 1 – Insignias */}
          {step === 1 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    insignias: [
                      ...(formData.insignias ?? []),
                      { nombre: "", descripcion: "", elementos: [] },
                    ],
                  })
                }
                className="flex items-center gap-2 text-blue-600 font-medium"
              >
                <Plus size={16} /> Añadir Insignia
              </button>

              {(formData.insignias ?? []).map((ins, idx) => (
                <div key={idx} className={cardStyle}>
                  <div className="flex justify-between items-center mb-2">
                    <strong>Insignia {idx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(formData.insignias ?? [])];
                        copy.splice(idx, 1);
                        setFormData({ ...formData, insignias: copy });
                      }}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <input
                    placeholder="Nombre insignia"
                    value={ins.nombre ?? ""}
                    onChange={(e) => {
                      const copy = [...(formData.insignias ?? [])];
                      copy[idx].nombre = e.target.value;
                      setFormData({ ...formData, insignias: copy });
                    }}
                    className="w-full border p-2 rounded mb-2"
                  />
                  <input
                    placeholder="Descripción"
                    value={ins.descripcion ?? ""}
                    onChange={(e) => {
                      const copy = [...(formData.insignias ?? [])];
                      copy[idx].descripcion = e.target.value;
                      setFormData({ ...formData, insignias: copy });
                    }}
                    className="w-full border p-2 rounded mb-2"
                  />

                  {/* Elementos */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(formData.insignias ?? [])];
                        copy[idx].elementos = [
                          ...(copy[idx].elementos ?? []),
                          { tipo: "", cantidad: 1 },
                        ];
                        setFormData({ ...formData, insignias: copy });
                      }}
                      className="flex items-center gap-1 text-green-600"
                    >
                      <Plus size={14} /> Añadir elemento
                    </button>

                    {(ins.elementos ?? []).map((el, eIdx) => (
                      <div key={eIdx} className="flex gap-2 items-center">
                        <input
                          placeholder="Tipo"
                          value={el.tipo ?? ""}
                          onChange={(ev) => {
                            const copy = [...(formData.insignias ?? [])];
                            copy[idx].elementos![eIdx].tipo = ev.target.value;
                            setFormData({ ...formData, insignias: copy });
                          }}
                          className="border p-2 rounded flex-1"
                        />
                        <input
                          type="number"
                          placeholder="Cantidad"
                          min={1}
                          value={el.cantidad ?? 1}
                          onChange={(ev) => {
                            const copy = [...(formData.insignias ?? [])];
                            copy[idx].elementos![eIdx].cantidad = Number(ev.target.value);
                            setFormData({ ...formData, insignias: copy });
                          }}
                          className="border p-2 rounded w-24"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...(formData.insignias ?? [])];
                            copy[idx].elementos!.splice(eIdx, 1);
                            setFormData({ ...formData, insignias: copy });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PASO 2 – Cortejos y Tramos */}
          {step === 2 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    cortejos: [
                      ...(formData.cortejos ?? []),
                      { nombre: "", orden: (formData.cortejos?.length ?? 0) + 1, tramos: [] },
                    ],
                  })
                }
                className="flex items-center gap-2 text-blue-600 font-medium"
              >
                <Plus size={16} /> Añadir Cortejo
              </button>

              {(formData.cortejos ?? []).map((c, idx) => (
                <div key={idx} className={cardStyle}>
                  <div className="flex justify-between items-center mb-2">
                    <strong>Cortejo {idx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(formData.cortejos ?? [])];
                        copy.splice(idx, 1);
                        setFormData({ ...formData, cortejos: copy });
                      }}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <input
                    placeholder="Nombre cortejo"
                    value={c.nombre ?? ""}
                    onChange={(e) => {
                      const copy = [...(formData.cortejos ?? [])];
                      copy[idx].nombre = e.target.value;
                      setFormData({ ...formData, cortejos: copy });
                    }}
                    className="w-full border p-2 rounded mb-2"
                  />

                  {/* Tramos */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(formData.cortejos ?? [])];
                        copy[idx].tramos = [
                          ...(copy[idx].tramos ?? []),
                          { nombre: "", orden: (copy[idx].tramos?.length ?? 0) + 1 },
                        ];
                        setFormData({ ...formData, cortejos: copy });
                      }}
                      className="flex items-center gap-1 text-green-600"
                    >
                      <Plus size={14} /> Añadir Tramo
                    </button>

                    {(c.tramos ?? []).map((t, tIdx) => (
                      <div key={tIdx} className="flex gap-2 items-center">
                        <input
                          placeholder="Nombre tramo"
                          value={t.nombre ?? ""}
                          onChange={(ev) => {
                            const copy = [...(formData.cortejos ?? [])];
                            copy[idx].tramos![tIdx].nombre = ev.target.value;
                            setFormData({ ...formData, cortejos: copy });
                          }}
                          className="border p-2 rounded flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...(formData.cortejos ?? [])];
                            copy[idx].tramos!.splice(tIdx, 1);
                            setFormData({ ...formData, cortejos: copy });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PASO 3 – Cargos y Puestos */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Cargos */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      cargos: [...(formData.cargos ?? []), { nombre: "" }],
                    })
                  }
                  className="flex items-center gap-2 text-blue-600 font-medium"
                >
                  <Plus size={16} /> Añadir Cargo
                </button>
                {(formData.cargos ?? []).map((c, idx) => (
                  <div key={idx} className={cardStyle}>
                    <div className="flex justify-between items-center mb-2">
                      <strong>Cargo {idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...(formData.cargos ?? [])];
                          copy.splice(idx, 1);
                          setFormData({ ...formData, cargos: copy });
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <input
                      placeholder="Nombre cargo"
                      value={c.nombre ?? ""}
                      onChange={(ev) => {
                        const copy = [...(formData.cargos ?? [])];
                        copy[idx].nombre = ev.target.value;
                        setFormData({ ...formData, cargos: copy });
                      }}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}
              </div>

              {/* Puestos */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      puestos: [...(formData.puestos ?? []), { nombre: "", codigo: "" }],
                    })
                  }
                  className="flex items-center gap-2 text-blue-600 font-medium mt-2"
                >
                  <Plus size={16} /> Añadir Puesto
                </button>
                {(formData.puestos ?? []).map((p, idx) => (
                  <div key={idx} className={cardStyle}>
                    <div className="flex justify-between items-center mb-2">
                      <strong>Puesto {idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...(formData.puestos ?? [])];
                          copy.splice(idx, 1);
                          setFormData({ ...formData, puestos: copy });
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <input
                      placeholder="Nombre puesto"
                      value={p.nombre ?? ""}
                      onChange={(ev) => {
                        const copy = [...(formData.puestos ?? [])];
                        copy[idx].nombre = ev.target.value;
                        setFormData({ ...formData, puestos: copy });
                      }}
                      className="w-full border p-2 rounded mb-2"
                    />
                    <input
                      placeholder="Código"
                      value={p.codigo ?? ""}
                      onChange={(ev) => {
                        const copy = [...(formData.puestos ?? [])];
                        copy[idx].codigo = ev.target.value;
                        setFormData({ ...formData, puestos: copy });
                      }}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4 – Resumen elegante */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Resumen de la Cofradía</h3>

              <div className={cardStyle}>
                <p>
                  <strong>Nombre:</strong> {formData.nombre ?? ""}
                </p>
                <p>
                  <strong>Año:</strong> {formData.anio ?? ""}
                </p>
                <p>
                  <strong>Tipo:</strong> {formData.tipo ?? ""}
                </p>
              </div>

              {(formData.insignias ?? []).length > 0 && (
                <div className={cardStyle}>
                  <h4 className="font-semibold mb-2">Insignias</h4>
                  {(formData.insignias ?? []).map((i, idx) => (
                    <div key={idx} className="mb-2">
                      <p>
                        <strong>{i.nombre ?? ""}</strong> {i.descripcion ?? ""}
                      </p>
                      {(i.elementos ?? []).length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {(i.elementos ?? []).map((el, eIdx) => (
                            <li key={eIdx}>
                              {el.tipo ?? ""} x {el.cantidad ?? 1}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(formData.cortejos ?? []).length > 0 && (
                <div className={cardStyle}>
                  <h4 className="font-semibold mb-2">Cortejos</h4>
                  {(formData.cortejos ?? []).map((c, idx) => (
                    <div key={idx} className="mb-2">
                      <p>
                        <strong>{c.nombre ?? ""}</strong>
                      </p>
                      {(c.tramos ?? []).length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {(c.tramos ?? []).map((t, tIdx) => (
                            <li key={tIdx}>{t.nombre ?? ""}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(formData.cargos ?? []).length > 0 && (
                <div className={cardStyle}>
                  <h4 className="font-semibold mb-2">Cargos</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {(formData.cargos ?? []).map((c, idx) => (
                      <li key={idx}>{c.nombre ?? ""}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(formData.puestos ?? []).length > 0 && (
                <div className={cardStyle}>
                  <h4 className="font-semibold mb-2">Puestos</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {(formData.puestos ?? []).map((p, idx) => (
                      <li key={idx}>
                        {p.nombre ?? ""} {p.codigo && `(${p.codigo})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="px-6 text-sm text-red-600">{error}</div>}

        {/* Footer */}
        <div className="flex justify-between border-t px-6 py-4 bg-white rounded-b-lg">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="rounded px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Atrás
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={nextStep}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear cofradía"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
