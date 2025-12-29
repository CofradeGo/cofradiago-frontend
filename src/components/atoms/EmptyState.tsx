interface Props {
  message: string;
}

export const EmptyState = ({ message }: Props) => (
  <div className="p-6 text-center text-gray-500 border rounded">{message}</div>
);
