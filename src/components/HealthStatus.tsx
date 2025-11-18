import React, { useEffect, useState } from "react";
import { getHealthStatus } from "../services/apiService.ts";

const HealthStatus: React.FC = () => {
  const [status, setStatus] = useState<string>("loading...");

  useEffect(() => {
    getHealthStatus()
      .then((res) => setStatus(res.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h2>Backend Health:</h2>
      <p>{status}</p>
    </div>
  );
};

export default HealthStatus;
