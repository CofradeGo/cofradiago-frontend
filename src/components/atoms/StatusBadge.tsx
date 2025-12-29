interface Props {
  estado: "ABIERTA" | "CERRADA";
}

export const StatusBadge = ({ estado }: Props) => {
  const styles = estado === "ABIERTA" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700";

  return <span className={`px-2 py-1 rounded text-sm font-medium ${styles}`}>{estado}</span>;
};
