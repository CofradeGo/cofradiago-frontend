export type HealthResponse = {
  status: string;
};

export async function getHealthStatus(): Promise<HealthResponse> {
  const response = await fetch("http://localhost:3000/health");
  if (!response.ok) throw new Error("Failed to fetch health status");
  return response.json();
}
